const pool = require("../config/db");
const userId = 1; // Hardcoded for development

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if already exists
        const existing = await pool.query(
            "SELECT * FROM cart WHERE product_id = $1 AND user_id = $2",
            [product_id, userId]
        );

        if (existing.rows.length > 0) {
            // Update quantity (Pass userId to array)
            await pool.query(
                "UPDATE cart SET quantity = quantity + $1 WHERE product_id = $2 AND user_id = $3",
                [quantity, product_id, userId]
            );
        } else {
            // Insert new (Fixed columns and placeholders)
            await pool.query(
                "INSERT INTO cart (product_id, quantity, user_id) VALUES ($1, $2, $3)",
                [product_id, quantity, userId]
            );
        }

        res.json({ message: "Added to cart" });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).send("Server Error");
    }
};

// GET CART
const getCart = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT cart.*, products.name, products.price, products.image_url
             FROM cart
             JOIN products ON cart.product_id = products.id
             WHERE cart.user_id = $1`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).send("Server Error");
    }
};

// UPDATE CART ITEM
const updateCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        await pool.query(
            "UPDATE cart SET quantity = $1 WHERE product_id = $2 AND user_id = $3",
            [quantity, product_id, userId]
        );

        res.json({ message: "Cart updated" });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).send("Server Error");
    }
};

// REMOVE ITEM
const removeFromCart = async (req, res) => {
    try {
        const { product_id } = req.params;

        await pool.query(
            "DELETE FROM cart WHERE product_id = $1 AND user_id = $2",
            [product_id, userId] // Added missing parameter
        );

        res.json({ message: "Item removed" });
    } catch (error) {
        console.error("Remove cart error:", error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
};
