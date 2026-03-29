const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrderById,
    getAllOrders
} = require("../controllers/orderController");

router.post("/", placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

module.exports = router;
