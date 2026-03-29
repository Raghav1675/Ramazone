const express = require("express");
const router = express.Router();


const { getProducts, getProductById } = require("../controllers/productController");
router.get("/search", (req, res) => res.redirect(`/api/products?search=${req.query.q}`)); // optional
router.get("/", getProducts);
router.get("/:id", getProductById);
module.exports = router;
