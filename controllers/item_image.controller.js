const multer = require('multer');
const ItemImage = require('../models/Item_image.model');
const { storage } = require('../config/firebase.config');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

// Set up multer for file uploads using memory storage
const storageConfig = multer.memoryStorage();
const upload = multer({ storage: storageConfig });

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Controller to create a new item image, including image upload to Firebase
exports.createItemImage = (req, res) => {
    uploadFields(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: "Error handling files.", error: err.message });
        }

        // Debugging output
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const file = req.files.image[0];
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileRef = ref(storage, `uploads/${fileName}`);

        try {
            await uploadBytes(fileRef, file.buffer);
            const image = await getDownloadURL(fileRef);

            const newItemImage = {
                product_item_id: req.body.product_item_id,
                image
            };

            const itemImageId = await ItemImage.create(newItemImage);
            res.status(201).json({
                success: true,
                message: "Item image created successfully!",
                data: { id: itemImageId, ...newItemImage }
            });
        } catch (err) {
            console.error("Firebase error:", err);
            res.status(500).json({ message: "Error uploading image to Firebase", error: err.message });
        }
    });
};

// Controller to fetch all item images
exports.getAllItemImages = async (req, res) => {
    try {
        const itemImages = await ItemImage.findAll();
        res.status(200).json({
            success: true,
            data: itemImages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching item images',
            error: err.message
        });
    }
};

// Controller to delete a specific item image
exports.deleteItemImage = async (req, res) => {
    const { id } = req.params; // Assumes id is passed as a URL parameter

    try {
        // Retrieve the image record to get the file path
        const itemImage = await ItemImage.findById(id);
        if (!itemImage) {
            return res.status(404).json({
                message: 'No item image found with this ID'
            });
        }

        const imagePath = itemImage.image;
        const fileRef = ref(storage, imagePath);

        await deleteObject(fileRef);

        const result = await ItemImage.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No item image found with this ID'
            });
        }

        res.status(200).json({
            message: 'Item image deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting item image',
            error: err.message
        });
    }
};

// Controller to delete all item images
exports.deleteAllItemImages = async (req, res) => {
    try {
        // Retrieve all image records to get file paths
        const itemImages = await ItemImage.findAll();

        if (itemImages.length === 0) {
            return res.status(404).json({
                message: 'No item images found'
            });
        }

        // Delete the files from Firebase Storage
        const deletePromises = itemImages.map(async (itemImage) => {
            const fileRef = ref(storage, itemImage.image);
            await deleteObject(fileRef);
        });

        await Promise.all(deletePromises);

        // Delete all records from the database
        const result = await ItemImage.deleteAll();

        res.status(200).json({
            message: 'All item images deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting all item images',
            error: err.message
        });
    }
};
