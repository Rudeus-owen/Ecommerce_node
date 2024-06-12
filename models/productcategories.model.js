const dbConn = require('../config/db.config');

class ProductCategory {
    constructor(productCategory) {
        this.id = productCategory.id;
        this.category_name = productCategory.category_name;
    }

    static async create(newProductCategory) {
        return new Promise((resolve, reject) => {
            dbConn.query("INSERT INTO product_category SET ?", newProductCategory, (err, res) => {
                if (err) {
                    console.error("Error creating product category:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            dbConn.query("SELECT * FROM product_category", (err, rows) => {
                if (err) {
                    console.error("Error getting product categories:", err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            dbConn.query("SELECT * FROM product_category WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.error("Error getting product category by id:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async updateById(id, updatedProductCategory) {
        return new Promise((resolve, reject) => {
            dbConn.query("UPDATE product_category SET category_name = ? WHERE id = ?", [updatedProductCategory.category_name, id], (err, res) => {
                if (err) {
                    console.error("Error updating product category:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async deleteById(id) {
        return new Promise((resolve, reject) => {
            dbConn.query("DELETE FROM product_category WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.error("Error deleting product category:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    
  static deleteAll() {
    return new Promise((resolve, reject) => {
      // Delete all products
      dbConn.query('DELETE FROM product_category', (err, result) => {
        if (err) {
          console.error("Error deleting all category:", err);
          reject(err);
          return;
        }
        // Reset the auto-increment value
        dbConn.query('ALTER TABLE product AUTO_INCREMENT = 1', (alterErr) => {
          if (alterErr) {
            console.error("Error resetting auto-increment value:", alterErr);
            reject(alterErr);
            return;
          }
          resolve({ message: "All products deleted and ID sequence reset" });
        });
      });
    });
  }
}

module.exports = ProductCategory;
