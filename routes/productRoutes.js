const express = require("express");
const router = express.Router();


const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    let values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND name ILIKE $${values.length}`;
    }

    if (category) {
      values.push(category);
      query += ` AND main_category = $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
router.get("/", getProducts);
module.exports = router;
