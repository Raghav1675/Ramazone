const pool = require("../config/db");

// GET PRODUCTS (with search + filter)
const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = `
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id
        `;

        let conditions = [];
        let values = [];

        // Search filter
        if (search) {
            values.push(`%${search}%`);
            conditions.push(`products.name ILIKE $${values.length}`);
        }

        // Category filter
        if (category) {
            values.push(category);
            conditions.push(`products.category_id = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// get by ID
// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT products.*, categories.name AS category_name
             FROM products
             LEFT JOIN categories ON products.category_id = categories.id
             WHERE products.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
module.exports = {
    getProducts,
    getProductById
};