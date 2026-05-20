const Address = require("../models/Address");

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, addressLine1, addressLine2, city, state, zipCode, country, addressType, isDefault } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !zipCode) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // If marking as default, unmark previous default
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country: country || "USA",
      addressType: addressType || "HOME",
      isDefault: isDefault || false,
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Addresses retrieved successfully",
      addresses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address retrieved successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { fullName, phoneNumber, addressLine1, addressLine2, city, state, zipCode, country, addressType, isDefault } = req.body;

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // If marking as default, unmark previous default
    if (isDefault && !address.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    // Update fields
    if (fullName) address.fullName = fullName;
    if (phoneNumber) address.phoneNumber = phoneNumber;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (addressType) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address deleted successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set default address
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Unset all previous defaults
    await Address.updateMany({ userId }, { isDefault: false });

    // Set the new default
    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Default address updated successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
