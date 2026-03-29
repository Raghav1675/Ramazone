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
        if (category && category !== "All") {
    values.push(category);
    conditions.push(`categories.name ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
// Sorting
if (req.query.sort) {
    switch (req.query.sort) {
        case "price_asc":
            query += " ORDER BY products.price ASC";
            break;
        case "price_desc":
            query += " ORDER BY products.price DESC";
            break;
        case "rating":
            query += " ORDER BY products.rating DESC";
            break;
        case "newest":
            query += " ORDER BY products.created_at DESC";
            break;
        default:
            query += " ORDER BY products.id DESC";
    }
} else {
    query += " ORDER BY products.id DESC";
}
        const limit  = parseInt(req.query.limit)  || 12;
const offset = parseInt(req.query.offset) || 0;
values.push(limit);
query += ` LIMIT $${values.length}`;
values.push(offset);
query += ` OFFSET $${values.length}`;

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
