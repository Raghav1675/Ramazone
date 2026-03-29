const pool = require("../config/db");
const nodemailer = require("nodemailer"); // <-- 1. Import Nodemailer

const userId = 1;

// Configure Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const getAllOrders = async (req, res) => {
    // ... (Keep existing getAllOrders)
};

// PLACE ORDER (Secure & Transactional + Email)
const placeOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const { address, email, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items to order" });
        }

        await client.query('BEGIN'); 

        let secureTotal = 0;
        let processedItems = [];
        let emailItemListHTML = ""; // To build the email receipt

        // 1. Check stock and calculate secure total
        for (let item of items) {
            const pId = item.product_id || item.id;
            const qty = item.quantity || 1;

            const productRes = await client.query(
                "SELECT name, price, stock, image_url FROM products WHERE id = $1 FOR UPDATE",
                [pId]
            );

            if (productRes.rows.length === 0) throw new Error(`Product ID ${pId} not found`);
            const product = productRes.rows[0];

            if (product.stock < qty) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
            }

            secureTotal += (Number(product.price) * qty);
            processedItems.push({ pId, qty, price: product.price, name: product.name });

            // Build HTML for this item
            emailItemListHTML += `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(product.price * qty).toLocaleString()}</td>
                </tr>
            `;
        }

        const deliveryCharge = secureTotal >= 499 ? 0 : 40;
        secureTotal += deliveryCharge;

        // 2. Create the order
        const orderResult = await client.query(
            "INSERT INTO orders (total_amount, address, email) VALUES ($1, $2, $3) RETURNING id",
            [secureTotal, address, email]
        );
        const orderId = orderResult.rows[0].id;

        // 3. Insert order items & update stock
        for (let item of processedItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
                [orderId, item.pId, item.qty, item.price]
            );
            await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.qty, item.pId]);
            await client.query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [userId, item.pId]);
        }

        await client.query('COMMIT'); // 🏆 Save Order to Database

        // 4. Send Confirmation Email (Non-blocking)
        if (email && process.env.SMTP_USER) {
            const mailOptions = {
                from: `"Ramazone 2.0" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Order Confirmation - Ramazone 2.0 (#${orderId})`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <div style="background: #131921; padding: 20px; text-align: center;">
                            <h1 style="color: #fff; margin: 0;">Rama<span style="color: #ff9900;">zone</span><span style="font-size: 14px; color: #febd69;">2.0</span></h1>
                        </div>
                        <div style="padding: 20px;">
                            <h2>Thank you for your order!</h2>
                            <p>Hi there,</p>
                            <p>Your order <strong>#${orderId}</strong> has been confirmed and is being processed. It will be shipped to:</p>
                            <p style="background: #f7f8f8; padding: 12px; border-radius: 4px;">${address}</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                <thead>
                                    <tr style="background: #f0f2f2;">
                                        <th style="padding: 10px; text-align: left;">Item</th>
                                        <th style="padding: 10px; text-align: center;">Qty</th>
                                        <th style="padding: 10px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${emailItemListHTML}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Delivery:</td>
                                        <td style="padding: 10px; text-align: right;">${deliveryCharge === 0 ? "FREE" : "₹" + deliveryCharge}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #cc0c39;">₹${secureTotal.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <p style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">This is an automated message from Ramazone 2.0. Please do not reply.</p>
                        </div>
                    </div>
                `
            };

            // Fire and forget (don't await) so it doesn't slow down the user's UI
            transporter.sendMail(mailOptions).catch(err => console.error("Email failed to send:", err));
        }

        res.json({ message: "Order placed successfully", order_id: orderId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Order Transaction Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    } finally {
        client.release();
    }
};

const getOrderById = async (req, res) => {
    // ... (Keep existing getOrderById)
};

module.exports = { placeOrder, getOrderById, getAllOrders };
