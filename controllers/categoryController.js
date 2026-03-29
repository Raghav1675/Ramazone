const pool = require("../config/db");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getCategories
};
