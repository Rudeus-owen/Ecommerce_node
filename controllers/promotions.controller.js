const Promotion = require('../models/promotions.model');

// Create a new promotion
exports.create = async (req, res) => {
  try {
    console.log(req.body); // Log the request body for debugging
    const newPromotion = new Promotion({
      promotion_name: req.body.promotion_name,
      description: req.body.description,
      promotion_type: req.body.promotion_type,
      discount_value: req.body.discount_value,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status,
      conditions: req.body.conditions,
    });

    const createdPromotion = await Promotion.create(newPromotion);
    res.status(201).json(createdPromotion);
  } catch (err) {
    res.status(500).json({ message: "Error creating promotion", error: err.message });
  }
};

// Retrieve all promotions
exports.findAll = async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching promotions", error: err.message });
  }
};

// Retrieve a single promotion by ID
exports.findOne = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: "Error fetching promotion", error: err.message });
  }
};

// Update a promotion by ID
exports.update = async (req, res) => {
  try {
    const updatedPromotion = new Promotion({
      promotion_name: req.body.promotion_name,
      description: req.body.description,
      promotion_type: req.body.promotion_type,
      discount_value: req.body.discount_value,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status,
      conditions: req.body.conditions,
    });

    const result = await Promotion.updateById(req.params.id, updatedPromotion);
    res.status(200).json({ message: "Promotion updated successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating promotion", error: err.message });
  }
};

// Delete a promotion by ID
exports.delete = async (req, res) => {
  try {
    await Promotion.delete(req.params.id);
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting promotion", error: err.message });
  }
};

// Delete all promotions
exports.deleteAll = async (req, res) => {
  try {
    await Promotion.deleteAll();
    res.status(200).json({ message: "All promotions deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all promotions", error: err.message });
  }
};
