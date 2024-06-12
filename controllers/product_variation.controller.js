const ProductVariation = require('../models/product_variation.model');

// Create a new product variation
exports.create = async (req, res) => {
  try {
    console.log('Received request to create product variation:', req.body); // Log the request body

    const { product_id, variation_name, qty_instock } = req.body;
    console.log('Extracted fields:', { product_id, variation_name, qty_instock }); // Log the extracted fields

    if (!product_id || !variation_name || !qty_instock) {
      throw new Error("All fields are required");
    }

    const newVariation = new ProductVariation({
      product_id, 
      variation_name,
      qty_instock,
    });

    const createdVariation = await ProductVariation.create(newVariation);
    res.status(201).json(createdVariation);
  } catch (err) {
    console.error("Error creating product variation:", err); // Log the error
    res.status(500).json({ message: "Error creating product variation", error: err.message });
  }
};

// Retrieve all product variations
exports.findAll = async (req, res) => {
  try {
    const variations = await ProductVariation.findAll();
    res.status(200).json(variations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product variations", error: err.message });
  }
};

// Retrieve a single product variation by ID
exports.findOne = async (req, res) => {
  try {
    const variation = await ProductVariation.findById(req.params.id);
    if (!variation) {
      return res.status(404).json({ message: "Product variation not found" });
    }
    res.status(200).json(variation);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product variation", error: err.message });
  }
};

// Update a product variation by ID
exports.update = async (req, res) => {
  try {
    const updatedVariation = new ProductVariation({
      product_id: req.body.product_id, // Ensure consistency here
      variation_name: req.body.variation_name,
      qty_instock: req.body.qty_instock,
    });

    const result = await ProductVariation.updateById(req.params.id, updatedVariation);
    res.status(200).json({ message: "Product variation updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating product variation", error: err.message });
  }
};

// Update product variations by condition
exports.updateByCondition = async (req, res) => {
  try {
    const condition = req.body.condition; // Expecting a string condition
    const updatedValues = {
      product_id: req.body.product_id,
      variation_name: req.body.variation_name,
      qty_instock: req.body.qty_instock
    };

    const result = await ProductVariation.updateByCondition(condition, updatedValues);
    res.status(200).json({ message: "Product variations updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating product variations", error: err.message });
  }
};

// Delete a product variation by ID
exports.delete = async (req, res) => {
  try {
    await ProductVariation.deleteById(req.params.id);
    res.status(200).json({ message: "Product variation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product variation", error: err.message });
  }
};

// Delete all product variations
exports.deleteAll = async (req, res) => {
  try {
    await ProductVariation.deleteAll();
    res.status(200).json({ message: "All product variations deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all product variations", error: err.message });
  }
};
