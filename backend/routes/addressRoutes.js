const express = require("express");
const {
  addAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All address routes require authentication
router.use(authMiddleware);

// Add a new address
router.post("/", addAddress);

// Get all addresses for the authenticated user
router.get("/", getUserAddresses);

// Get a single address by ID
router.get("/:id", getAddressById);

// Update an address
router.put("/:id", updateAddress);

// Delete an address
router.delete("/:id", deleteAddress);

// Set default address
router.patch("/:id/set-default", setDefaultAddress);

module.exports = router;
