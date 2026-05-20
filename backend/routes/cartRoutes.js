const express = require("express");

const router = express.Router();

const {
    addToCart,
    getUserCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getUserCart);

router.put("/", authMiddleware, updateCartItem);

router.delete("/:productId", authMiddleware, removeCartItem);

router.delete("/", authMiddleware, clearCart);

module.exports = router;