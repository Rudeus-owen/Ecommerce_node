const dbConn = require('../config/db.config');

class Subcategory {
    constructor(subcategory) {
        this.id = subcategory.id;
        this.product_category_id = subcategory.product_category_id;
        this.name = subcategory.name;
    }

    static async create(newSubcategory) {
        return new Promise((resolve, reject) => {
            dbConn.query("INSERT INTO sub_category SET ?", newSubcategory, (err, res) => {
                if (err) {
                    console.error("Error creating subcategory:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            dbConn.query("SELECT * FROM sub_category", (err, rows) => {
                if (err) {
                    console.error("Error getting subcategories:", err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            dbConn.query("SELECT * FROM sub_category WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.error("Error getting subcategory by id:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async updateById(id, updatedSubcategory) {
        return new Promise((resolve, reject) => {
            dbConn.query("UPDATE sub_category SET product_category_id = ?, name = ? WHERE id = ?", [updatedSubcategory.product_category_id, updatedSubcategory.name, id], (err, res) => {
                if (err) {
                    console.error("Error updating subcategory:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async deleteById(id) {
        return new Promise((resolve, reject) => {
            dbConn.query("DELETE FROM sub_category WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.error("Error deleting subcategory:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    
    
  static deleteAll() {
    return new Promise((resolve, reject) => {
    
      dbConn.query('DELETE FROM sub_category', (err, result) => {
        if (err) {
          console.error("Error deleting all sub_category:", err);
          reject(err);
          return;
        }
      
        dbConn.query('ALTER TABLE sub_category AUTO_INCREMENT = 1', (alterErr) => {
          if (alterErr) {
            console.error("Error resetting auto-increment value:", alterErr);
            reject(alterErr);
            return;
          }
          resolve({ message: "All sub_category deleted and ID sequence reset" });
        });
      });
    });
  }
}

module.exports = Subcategory;
