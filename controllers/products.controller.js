const Products = require('../models/products.model');

// Create a new product
exports.create = async (req, res) => {
  try {
    const newProduct = new Products({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
    });

    const createdProduct = await Products.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// Retrieve all products
exports.findAll = async (req, res) => {
  try {
    const products = await Products.findAll();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// Retrieve a single product by ID
exports.findOne = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// Update a product by ID
exports.update = async (req, res) => {
  try {
    const updatedProduct = new Products({
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
    });

    const result = await Products.updateById(req.params.id, updatedProduct);
    res.status(200).json({ message: "Product updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

// Delete a product by ID
exports.delete = async (req, res) => {
  try {
    await Products.delete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

// Delete all products
exports.deleteAll = async (req, res) => {
  try {
    await Products.deleteAll();
    res.status(200).json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all products", error: err.message });
  }
};
