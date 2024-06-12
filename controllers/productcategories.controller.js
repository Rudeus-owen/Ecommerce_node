const ProductCategory = require('../models/productcategories.model');

// Create a new product category
exports.create = async (req, res) => {
    try {
        const newCategory = new ProductCategory(req.body);
        const result = await ProductCategory.create(newCategory);
        res.status(201).send({ message: 'Product Category Created', data: result });
    } catch (err) {
        res.status(500).send({ message: 'Error creating product category', error: err });
    }
};

// Retrieve all product categories
exports.findAll = async (req, res) => {
    try {
        const categories = await ProductCategory.getAll();
        res.status(200).send(categories);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving product categories', error: err });
    }
};

// Retrieve a single product category by ID
exports.findOne = async (req, res) => {
    try {
        const category = await ProductCategory.getById(req.params.id);
        if (category.length === 0) {
            res.status(404).send({ message: 'Product Category not found' });
        } else {
            res.status(200).send(category[0]);
        }
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving product category', error: err });
    }
};

// Update a product category by ID
exports.update = async (req, res) => {
    try {
        const result = await ProductCategory.updateById(req.params.id, req.body);
        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Product Category not found' });
        } else {
            res.status(200).send({ message: 'Product Category Updated' });
        }
    } catch (err) {
        res.status500.send({ message: 'Error updating product category', error: err });
    }
};

// Delete a product category by ID
exports.delete = async (req, res) => {
    try {
        const result = await ProductCategory.deleteById(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Product Category not found' });
        } else {
            res.status(200).send({ message: 'Product Category Deleted' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error deleting product category', error: err });
    }
};

// Delete all product categories
exports.deleteAll = async (req, res) => {
    try {
        const result = await ProductCategory.deleteAll();
        res.send({ message: `Categories were deleted successfully!` });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while removing all categories." });
    }
};
