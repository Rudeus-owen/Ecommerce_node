const Items = require('../models/item.model');

// Create a new item
exports.create = async (req, res) => {
  try {
    const newItem = new Items({
      id: req.body.id, // Ensure the id is passed in the request body
      product_id: req.body.product_id,
      promotion_id: req.body.promotion_id,
      item_image: req.body.item_image // New column
    });

    const createdItem = await Items.create(newItem);
    res.status(201).json(createdItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating item", error: err.message });
  }
};

// Retrieve all items
exports.findAll = async (req, res) => {
  try {
    const items = await Items.findAll();
    res.status(200).json(items);
  } catch (err) {
    res.status (500).json({ message: "Error fetching items", error: err.message });
  }
};

// Retrieve a single item by ID
exports.findOne = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item", error: err.message });
  }
};

// Update an item by ID
exports.update = async (req, res) => {
  try {
    const updatedItem = new Items({
      id: req.params.id, // Ensure the id is passed in the request params
      product_id: req.body.product_id,
      promotion_id: req.body.promotion_id,
      item_image: req.body.item_image // New column
    });

    const result = await Items.updateById(req.params.id, updatedItem);
    res.status(200).json({ message: "Item updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating item", error: err.message });
  }
};

// Delete an item by ID
exports.delete = async (req, res) => {
  try {
    await Items.delete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
};

// Delete all items
exports.deleteAll = async (req, res) => {
  try {
    await Items.deleteAll();
    res.status(200).json({ message: "All items deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all items", error: err.message });
  }
};
