const dbConn = require('../config/db.config');

class Items {
  constructor(items) {
    this.id = items.id;
    this.product_id = items.product_id;
    this.promotion_id = items.promotion_id;
    
  }

  static create(newItem) {
    return new Promise((resolve, reject) => {
      dbConn.query(
        'INSERT INTO item (id, product_id, promotion_id) VALUES (?, ?, ?)', 
        [
          newItem.id,
          newItem.product_id,
          newItem.promotion_id,
         
        ], 
        (err, result) => {
          if (err) {
            console.error("Error creating item:", err);
            reject(err);
            return;
          }
          resolve({ id: newItem.id, message: "Item created successfully" });
        }
      );
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      dbConn.query("SELECT * FROM item", (err, res) => {
        if (err) {
          console.error("Error fetching items:", err);
          reject(err);
          return;
        }
        const items = res.map(item => new Items(item));
        resolve(items);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('SELECT * FROM item WHERE id = ?', [id], (err, res) => {
        if (err) {
          console.error("Error fetching item:", err);
          reject(err);
          return;
        }
        if (res.length) {
          resolve(new Items(res[0]));
        } else {
          resolve(null); // No item found with the given id
        }
      });
    });
  }

  static updateById(id, updatedItem) {
    return new Promise((resolve, reject) => {
      dbConn.query('UPDATE item SET product_id = ?, promotion_id = ?, item_image = ? WHERE id = ?', [
        updatedItem.product_id,
        updatedItem.promotion_id,
        updatedItem.item_image, // New column
        id
      ], (err, result) => {
        if (err) {
          console.error("Error updating item:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static delete(itemId) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM item WHERE id = ?', [itemId], (err, result) => {
        if (err) {
          console.error("Error deleting item:", err);
          reject(err);
          return;
        }
        if (result.affectedRows === 0) {
          reject(new Error("No item found with the provided ID"));
          return;
        }
        resolve({ id: itemId, message: "Item deleted successfully" });
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM item', (err, result) => {
        if (err) {
          console.error("Error deleting all items:", err);
          reject(err);
          return;
        }
        resolve({ message: "All items deleted successfully" });
      });
    });
  }
}

module.exports = Items;
