const pool = require("../config/db");

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if already exists
        const existing = await pool.query(
            "SELECT * FROM cart WHERE product_id = $1",
            [product_id]
        );

        if (existing.rows.length > 0) {
            // Update quantity
            await pool.query(
                "UPDATE cart SET quantity = quantity + $1 WHERE product_id = $2",
                [quantity, product_id]
            );
        } else {
            // Insert new
            await pool.query(
                "INSERT INTO cart (product_id, quantity) VALUES ($1, $2)",
                [product_id, quantity]
            );
        }

        res.json({ message: "Added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// GET CART
const getCart = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT cart.*, products.name, products.price, products.image_url
             FROM cart
             JOIN products ON cart.product_id = products.id`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// UPDATE CART ITEM
const updateCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        await pool.query(
            "UPDATE cart SET quantity = $1 WHERE product_id = $2",
            [quantity, product_id]
        );

        res.json({ message: "Cart updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// REMOVE ITEM
const removeFromCart = async (req, res) => {
    try {
        const { product_id } = req.params;

        await pool.query(
            "DELETE FROM cart WHERE product_id = $1",
            [product_id]
        );

        res.json({ message: "Item removed" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
};