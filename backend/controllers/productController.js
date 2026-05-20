const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      // stock,
      category,
      // images,
    } = req.body;

    console.log(req.files);
    console.log(req.body);
    console.log(req.user);

    const imageUrls = req.files?.map((file) => file.path) || [];

    if (
      !title ||
      !description ||
      !price ||
      // !stock ||
      !category ||
      !imageUrls?.length
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      // stock,
      category,
      images: imageUrls,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

const getAllProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const categoryFilter = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 8;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({
      ...keyword,
      ...categoryFilter,
    });

    const products = await Product.find({
      ...keyword,
      ...categoryFilter,
    })
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      price,
      category,
    } = req.body;

    // Handle images
    let images = product.images; // Keep existing images by default

    // If new images are uploaded, get their URLs
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => file.path);
      images = newImageUrls;
    }

    // If existingImages is provided (old images to keep)
    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      
      // Combine new images with existing images
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map((file) => file.path);
        images = [...existingImages, ...newImageUrls];
      } else {
        images = existingImages;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: title || product.title,
        description: description || product.description,
        price: price || product.price,
        category: category || product.category,
        images: images,
      },
      { new: true },
    );

    res.status(200).json(updatedProduct);
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).populate("seller", "name email");

    res.status(200).json(products);
  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        error: err,
    });
}
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};
