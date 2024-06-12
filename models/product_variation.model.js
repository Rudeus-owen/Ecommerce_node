const dbConn = require('../config/db.config');

class ProductVariation {
  constructor(variation) {
    this.id = variation.id;
    this.product_id = variation.product_id;
    this.variation_name = variation.variation_name;
    this.qty_instock = variation.qty_instock;
  }

  static create(newVariation) {
    return new Promise((resolve, reject) => {
      console.log('Inserting new product variation:', newVariation);
      dbConn.query(
        'INSERT INTO product_variation (product_id, variation_name, qty_instock) VALUES (?, ?, ?)', 
        [
          newVariation.product_id, 
          newVariation.variation_name,
          newVariation.qty_instock
        ], 
        (err, result) => {
          if (err) {
            console.error("Error creating product variation:", err);
            reject(err);
            return;
          }
          const insertedVariationId = result.insertId;
          resolve({ id: insertedVariationId, message: "Product variation created successfully" });
        }
      );
    });
  }

  static updateById(id, updatedVariation) {
    return new Promise((resolve, reject) => {
      dbConn.query('UPDATE product_variation SET product_id = ?, variation_name = ?, qty_instock = ? WHERE id = ?', [
        updatedVariation.product_id, 
        updatedVariation.variation_name,
        updatedVariation.qty_instock,
        id
      ], (err, result) => {
        if (err) {
          console.error("Error updating product variation:", err);
          reject(err);
          return;
        }
        resolve({ message: "Product variation updated successfully" });
      });
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product_variation WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error("Error deleting product variation:", err);
          reject(err);
          return;
        }
        resolve({ message: "Product variation deleted successfully" });
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product_variation', (err, result) => {
        if (err) {
          console.error("Error deleting all product variations:", err);
          reject(err);
          return;
        }
        resolve({ message: "All product variations deleted successfully" });
      });
    });
  }

  static updateByCondition(condition, updatedValues) {
    const { product_id, variation_name, qty_instock } = updatedValues;
    const sqlQuery = 'UPDATE product_variation SET product_id = ?, variation_name = ?, qty_instock = ? WHERE ' + condition;

    return new Promise((resolve, reject) => {
      dbConn.query(sqlQuery, [product_id, variation_name, qty_instock], (err, result) => {
        if (err) {
          console.error("Error updating product variations by condition:", err);
          reject(err);
          return;
        }
        resolve({ message: "Product variations updated successfully" });
      });
    });
  }
}

module.exports = ProductVariation;
