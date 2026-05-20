const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            })
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        )

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: quantity || 1,
            })
        }

        await cart.save();
        await cart.populate("items.product");

        const totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        const totalAmount = cart.items.reduce(
            (acc, item) => acc + (item.product.price * item.quantity),
            0
        );

        res.status(200).json({ message: "Product added to cart", cart, totalItems, totalAmount });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            return res.status(200).json({ items: [] })
        }

        const totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );

        const totalAmount = cart.items.reduce(
            (acc, item) =>
                acc + (item.product.price * item.quantity),
            0
        );

        res.status(200).json({
            cart,
            totalItems,
            totalAmount,
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateCartItem = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({
            user: req.user._id,
        })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            );
        } else {
            const item = cart.items.find(
                item => item.product.toString() === productId
            )

            if (!item) {
                return res.status(404).json({ message: "Product not found in cart" })
            }

            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        const totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        const totalAmount = cart.items.reduce(
            (acc, item) => acc + (item.product.price * item.quantity),
            0
        );

        res.status(200).json({ message: "Cart updated", cart, totalItems, totalAmount });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const removeCartItem = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        await cart.populate("items.product");

        const totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        const totalAmount = cart.items.reduce(
            (acc, item) => acc + (item.product.price * item.quantity),
            0
        );

        res.status(200).json({ message: "Item removed from cart", cart, totalItems, totalAmount });

    } catch (err) {

        res.status(500).json({ message: err.message })

    }
}

const clearCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found",
            });

        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: "Cart cleared",
            cart,
            totalItems: 0,
            totalAmount: 0,
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

module.exports = {
    addToCart,
    getUserCart,
    updateCartItem,
    removeCartItem,
    clearCart,
}