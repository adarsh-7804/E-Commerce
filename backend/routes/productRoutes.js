const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
}   = require('../controllers/productController');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/" , getAllProducts);

router.get("/seller/my-products", authMiddleware, roleMiddleware("seller", "admin"), getSellerProducts);

router.get("/:id" , getSingleProduct);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller", "admin"),

  (req, res, next) => {

    upload.array("images", 5)(req, res, function (err) {

      if (err) {

        console.log("MULTER ERROR:", err);

        return res.status(500).json({
          success: false,
          message: err.message,
          error: err,
        });
      }

      next();
    });
  },

  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  (req, res, next) => {
    upload.array("images", 5)(req, res, function (err) {
      if (err) {
        console.log("MULTER ERROR:", err);
        return res.status(500).json({
          success: false,
          message: err.message,
          error: err,
        });
      }
      next();
    });
  },
  updateProduct
);

router.delete("/:id" , authMiddleware, roleMiddleware("seller", "admin"), deleteProduct);


module.exports = router;