const pool = require("../config/db");

// PLACE ORDER
const placeOrder = async (req, res) => {
    try {
        const { address } = req.body;

        // 1. Get cart items
        const cartItems = await pool.query(
            `SELECT cart.*, products.price
             FROM cart
             JOIN products ON cart.product_id = products.id`
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Calculate total
        let total = 0;
        cartItems.rows.forEach(item => {
            total += item.price * item.quantity;
        });

        // 3. Create order
        const orderResult = await pool.query(
            "INSERT INTO orders (total_amount, address) VALUES ($1, $2) RETURNING *",
            [total, address]
        );

        const orderId = orderResult.rows[0].id;

        // 4. Insert order items
        for (let item of cartItems.rows) {

    // 1. Check stock
    const stockRes = await pool.query(
        "SELECT stock FROM products WHERE id = $1",
        [item.product_id]
    );

    const currentStock = stockRes.rows[0]?.stock || 0;

    if (currentStock < item.quantity) {
        return res.status(400).json({
            message: `Not enough stock for product ID ${item.product_id}`
        });
    }

    // 2. Insert order item
    await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
    );

    // 3. Reduce stock
    await pool.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
    );
        }

        // 5. Clear cart
        await pool.query("DELETE FROM cart");

        // 6. Return order ID
        res.json({
            message: "Order placed successfully",
            order_id: orderId
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
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

        const items = await pool.query(
            `SELECT order_items.*, products.name
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
    getOrderById
};
