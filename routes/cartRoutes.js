const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

router.post("/", addToCart);
router.get("/", getCart);
router.put("/", updateCart);
router.delete("/:product_id", removeFromCart);

module.exports = router;