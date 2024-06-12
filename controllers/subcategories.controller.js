const Subcategory = require('../models/subcategories.model');

// Create a new subcategory
exports.create = async (req, res) => {
    try {
        const newSubcategory = new Subcategory(req.body);
        const result = await Subcategory.create(newSubcategory);
        res.status(201).send({ message: 'Subcategory Created', data: result });
    } catch (err) {
        res.status(500).send({ message: 'Error creating subcategory', error: err });
    }
};

// Retrieve all subcategories
exports.findAll = async (req, res) => {
    try {
        const subcategories = await Subcategory.getAll();
        res.status(200).send(subcategories);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving subcategories', error: err });
    }
};

// Retrieve a single subcategory by ID
exports.findOne = async (req, res) => {
    try {
        const subcategory = await Subcategory.getById(req.params.id);
        if (subcategory.length === 0) {
            res.status(404).send({ message: 'Subcategory not found' });
        } else {
            res.status(200).send(subcategory[0]);
        }
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving subcategory', error: err });
    }
};

// Update a subcategory by ID
exports.update = async (req, res) => {
    try {
        const result = await Subcategory.updateById(req.params.id, req.body);
        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Subcategory not found' });
        } else {
            res.status(200).send({ message: 'Subcategory Updated' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error updating subcategory', error: err });
    }
};

// Delete a subcategory by ID
exports.delete = async (req, res) => {
    try {
        const result = await Subcategory.deleteById(req.params.id);
        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Subcategory not found' });
        } else {
            res.status(200).send({ message: 'Subcategory Deleted' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error deleting subcategory', error: err });
    }
};

exports.deleteAll = async (req, res) => {
    try {
      await Subcategory.deleteAll();
      res.status(200).json({ message: "All sub_category deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting all sub_category", error: err.message });
    }
  };