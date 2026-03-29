const pool = require("../config/db");

// Hardcoded for development
const userId = 1;

const getAllOrders = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM orders ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// PLACE ORDER (Secure & Transactional)
const placeOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const { address, email, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items to order" });
        }

        await client.query('BEGIN'); // Start transaction

        let secureTotal = 0;
        let processedItems = [];

        // 1. Check stock and calculate secure total securely on the backend
        for (let item of items) {
            const pId = item.product_id || item.id;
            const qty = item.quantity || 1;

            // Lock row to prevent race conditions during checkout
            const productRes = await client.query(
                "SELECT name, price, stock FROM products WHERE id = $1 FOR UPDATE",
                [pId]
            );

            if (productRes.rows.length === 0) {
                throw new Error(`Product ID ${pId} not found`);
            }

            const product = productRes.rows[0];

            if (product.stock < qty) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Only ${product.stock} left.`
                });
            }

            // Calculate price securely based on DB value
            secureTotal += (Number(product.price) * qty);
            processedItems.push({ pId, qty, price: product.price, name: product.name });
        }

        // Add delivery logic (Free above 499, else 40)
        const deliveryCharge = secureTotal >= 499 ? 0 : 40;
        secureTotal += deliveryCharge;

        // 2. Create the order
        const orderResult = await client.query(
            "INSERT INTO orders (total_amount, address, email) VALUES ($1, $2, $3) RETURNING id",
            [secureTotal, address, email]
        );
        const orderId = orderResult.rows[0].id;

        // 3. Insert order items, update stock, and carefully clear cart
        for (let item of processedItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.pId, item.qty, item.price]
            );

            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2",
                [item.qty, item.pId]
            );

            // Selectively delete ONLY the items purchased (fixes Buy Now wiping the whole cart)
            await client.query(
                "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
                [userId, item.pId]
            );
        }

        await client.query('COMMIT'); // Save everything

        res.json({
            message: "Order placed successfully",
            order_id: orderId
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revert changes on error
        console.error("Order Transaction Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    } finally {
        client.release();
    }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await pool.query(
            "SELECT * FROM orders WHERE id = $1",
            [id]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await pool.query(
            `SELECT order_items.*, products.name, products.category_id 
             FROM order_items
             JOIN products ON order_items.product_id = products.id
             WHERE order_id = $1`,
            [id]
        );

        res.json({
            order: order.rows[0],
            items: items.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    placeOrder,
    getOrderById,
    getAllOrders
};
