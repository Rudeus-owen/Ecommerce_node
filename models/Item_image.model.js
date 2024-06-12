const dbConn = require('../config/db.config');

class ItemImage {
  constructor(itemImage) {
    this.id = itemImage.id;
    this.product_item_id = itemImage.product_item_id;
    this.image = itemImage.image;
  }

  static create(newItemImage) {
    return new Promise((resolve, reject) => {
      dbConn.query('INSERT INTO item_image (product_item_id, image) VALUES (?, ?)', [
        newItemImage.product_item_id,
        newItemImage.image
      ], (err, result) => {
        if (err) {
          console.error("Error creating item image:", err);
          reject(err);
          return;
        }
        const insertedItemImageId = result.insertId;
        resolve(insertedItemImageId);
      });
    });
  }

  static findAll(id = null) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM item_image";
        const params = [];
        if (id) {
            query += " WHERE id = ?";
            params.push(id);
        }
        dbConn.query(query, params, (err, res) => {
            if (err) {
                console.error("Error fetching item images:", err);
                reject(err);
                return;
            }
            const itemImages = res.map(itemImage => new ItemImage(itemImage));
            resolve(itemImages);
        });
    });
}


  static delete(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM item_image WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error("Error deleting item image:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM item_image', (err, result) => {
        if (err) {
          console.error("Error deleting all item images:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = ItemImage;
