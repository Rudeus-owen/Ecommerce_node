const multer = require('multer');
const ProductImage = require('../models/productimage.model');
const { storage } = require('../config/firebase.config');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

// Set up multer for file uploads using memory storage
const storageConfig = multer.memoryStorage();
const upload = multer({ storage: storageConfig });

const uploadFields = upload.fields([
    { name: 'product_img', maxCount: 1 }
]);

// Controller to create a new product image, including image upload to Firebase
exports.createProductImage = (req, res) => {
    uploadFields(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: "Error handling files.", error: err.message });
        }

        // Debugging output
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        if (!req.files || !req.files.product_img || req.files.product_img.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const file = req.files.product_img[0];
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileRef = ref(storage, `uploads/${fileName}`);

        try {
            await uploadBytes(fileRef, file.buffer);
            const product_img = await getDownloadURL(fileRef);

            const newProductImage = {
                product_id: req.body.product_id,
                product_img
            };

            const productImageId = await ProductImage.create(newProductImage);
            res.status(201).json({
                success: true,
                message: "Product image created successfully!",
                data: { id: productImageId, ...newProductImage }
            });
        } catch (err) {
            console.error("Firebase error:", err);
            res.status(500).json({ message: "Error uploading image to Firebase", error: err.message });
        }
    });
};

// Controller to fetch all product images
exports.getAllProductImages = async (req, res) => {
    try {
        const productImages = await ProductImage.findAll();
        res.status(200).json({
            success: true,
            data: productImages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching product images',
            error: err.message
        });
    }
};

// Controller to delete a product image
exports.deleteProductImage = async (req, res) => {
    const { id } = req.params; // Assumes id is passed as a URL parameter

    try {
        const productImage = await ProductImage.findById(id);
        if (!productImage) {
            return res.status(404).json({
                message: 'No product image found with this ID'
            });
        }

        const imagePath = productImage.product_img;
        const fileRef = ref(storage, imagePath);

        await deleteObject(fileRef);

        const result = await ProductImage.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No product image found with this ID'
            });
        }
        res.status(200).json({
            message: 'Product image deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting product image',
            error: err.message
        });
    }
};

// Controller to delete all product images
exports.deleteAllProductImages = async (req, res) => {
    try {
        const productImages = await ProductImage.findAll();

        if (productImages.length === 0) {
            return res.status(404).json({
                message: 'No product images found'
            });
        }

        const deletePromises = productImages.map(async (productImage) => {
            if (typeof productImage.product_img === 'string') {
                const fileRef = ref(storage, productImage.product_img);
                await deleteObject(fileRef);
            }
        });

        await Promise.all(deletePromises);

        const result = await ProductImage.deleteAll();

        res.status(200).json({
            message: 'All product images deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting all product images',
            error: err.message
        });
    }
};
