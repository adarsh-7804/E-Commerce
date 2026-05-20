// const multer = require('multer');

// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// const cloudinary = require('../config/cloudinary');

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'ecommerce_products',

//         allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     }
// })

// const upload = multer({ storage });

// module.exports = upload;


const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "ecommerce_products",

    format: file.mimetype.split("/")[1],

    public_id: Date.now() + "-" + file.originalname,
  }),
});

const upload = multer({
  storage,
});

module.exports = upload;