const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});
// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const pool = require("./config/db");

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
const orderRoutes=require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);
