const express = require('express');

const router = express.Router();

const authmiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get(
    '/profile',
    authmiddleware,
    (req, res) => {
        res.json({
            message: "User profile",
            user: req.user
        });
    }
);

router.get(
    "/seller-dashboard",
    authmiddleware,
    roleMiddleware("seller", "admin"),
    (req, res) => {
        res.json({
            message: "Welcome to seller dashboard"
        })
    }
)

router.get(
    "/admin-dashboard",
    authmiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            message: "Welcome to admin dashboard"
        })
    }
)

module.exports = router;