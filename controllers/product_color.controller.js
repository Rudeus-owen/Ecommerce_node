const ProductColor = require('../models/product_color.model');

// Create a new product color
exports.create = async (req, res) => {
  try {
    const newColor = new ProductColor({
      color_name: req.body.color_name,
      color_code: req.body.color_code,
      qty_instock: req.body.qty_instock,
      product_item_id: req.body.product_item_id
    });

    const createdColor = await ProductColor.create(newColor);
    res.status(201).json(createdColor);
  } catch (err) {
    res.status(500).json({ message: "Error creating product color", error: err.message });
  }
};

// Retrieve all product colors
exports.findAll = async (req, res) => {
  try {
    const colors = await ProductColor.findAll();
    res.status(200).json(colors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product colors", error: err.message });
  }
};

// Retrieve a single product color by ID
exports.findOne = async (req, res) => {
  try {
    const color = await ProductColor.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Product color not found" });
    }
    res.status(200).json(color);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product color", error: err.message });
  }
};

// Update a product color by ID
exports.update = async (req, res) => {
  try {
    const updatedColor = new ProductColor({
      color_name: req.body.color_name,
      color_code: req.body.color_code,
      qty_instock: req.body.qty_instock,
      product_item_id: req.body.product_item_id
    });

    const result = await ProductColor.updateById(req.params.id, updatedColor);
    res.status(200).json({ message: "Product color updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating product color", error: err.message });
  }
};

// Delete a product color by ID
exports.delete = async (req, res) => {
  try {
    await ProductColor.delete(req.params.id);
    res.status(200).json({ message: "Product color deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product color", error: err.message });
  }
};

// Delete all product colors
exports.deleteAll = async (req, res) => {
  try {
    await ProductColor.deleteAll();
    res.status(200).json({ message: "All product colors deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all product colors", error: err.message });
  }
};
