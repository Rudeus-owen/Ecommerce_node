const dbConn = require('../config/db.config');

class ProductColor {
  constructor(color) {
    this.id = color.id;
    this.color_name = color.color_name;
    this.color_code = color.color_code;
    this.qty_instock = color.qty_instock;
    this.product_item_id = color.product_item_id;
  }

  static create(newColor) {
    return new Promise((resolve, reject) => {
      dbConn.query(
        'INSERT INTO product_color (color_name, color_code, qty_instock, product_item_id) VALUES (?, ?, ?, ?)', 
        [
          newColor.color_name,
          newColor.color_code,
          newColor.qty_instock,
          newColor.product_item_id
        ], 
        (err, result) => {
          if (err) {
            console.error("Error creating product color:", err);
            reject(err);
            return;
          }
          const insertedColorId = result.insertId;
          resolve({ id: insertedColorId, message: "Product color created successfully" });
        }
      );
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      dbConn.query("SELECT * FROM product_color", (err, res) => {
        if (err) {
          console.error("Error fetching product colors:", err);
          reject(err);
          return;
        }
        const colors = res.map(color => new ProductColor(color));
        resolve(colors);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('SELECT * FROM product_color WHERE id = ?', [id], (err, res) => {
        if (err) {
          console.error("Error fetching product color:", err);
          reject(err);
          return;
        }
        if (res.length) {
          resolve(new ProductColor(res[0]));
        } else {
          resolve(null); // No product color found with the given id
        }
      });
    });
  }

  static updateById(id, updatedColor) {
    return new Promise((resolve, reject) => {
      dbConn.query('UPDATE product_color SET color_name = ?, color_code = ?, qty_instock = ?, product_item_id = ? WHERE id = ?', [
        updatedColor.color_name,
        updatedColor.color_code,
        updatedColor.qty_instock,
        updatedColor.product_item_id,
        id
      ], (err, result) => {
        if (err) {
          console.error("Error updating product color:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static delete(colorId) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product_color WHERE id = ?', [colorId], (err, result) => {
        if (err) {
          console.error("Error deleting product color:", err);
          reject(err);
          return;
        }
        if (result.affectedRows === 0) {
          reject(new Error("No product color found with the provided ID"));
          return;
        }

        // Check if there are any remaining product colors
        dbConn.query('SELECT COUNT(*) AS count FROM product_color', (countErr, countResult) => {
          if (countErr) {
            console.error("Error counting product colors:", countErr);
            reject(countErr);
            return;
          }

          const remainingColors = countResult[0].count;
          if (remainingColors === 0) {
            // Reset the auto-increment value
            dbConn.query('ALTER TABLE product_color AUTO_INCREMENT = 1', (alterErr) => {
              if (alterErr) {
                console.error("Error resetting auto-increment value:", alterErr);
                reject(alterErr);
                return;
              }
              resolve({ id: colorId, message: "Product color deleted successfully and ID sequence reset" });
            });
          } else {
            resolve({ id: colorId, message: "Product color deleted successfully" });
          }
        });
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      // Delete all product colors
      dbConn.query('DELETE FROM product_color', (err, result) => {
        if (err) {
          console.error("Error deleting all product colors:", err);
          reject(err);
          return;
        }
        // Reset the auto-increment value
        dbConn.query('ALTER TABLE product_color AUTO_INCREMENT = 1', (alterErr) => {
          if (alterErr) {
            console.error("Error resetting auto-increment value:", alterErr);
            reject(alterErr);
            return;
          }
          resolve({ message: "All product colors deleted and ID sequence reset" });
        });
      });
    });
  }
}

module.exports = ProductColor;
