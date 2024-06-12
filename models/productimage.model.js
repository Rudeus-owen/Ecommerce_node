const dbConn = require('../config/db.config');

class ProductImage {
  constructor(productImage) {
    this.id = productImage.id;
    this.product_id = productImage.product_id;
    this.product_img = productImage.product_img;
  }

  static create(newProductImage) {
    return new Promise((resolve, reject) => {
      dbConn.query('INSERT INTO product_image (product_id, product_img) VALUES (?, ?)', [
        newProductImage.product_id,
        newProductImage.product_img
      ], (err, result) => {
        if (err) {
          console.error("Error creating product image:", err);
          reject(err);
          return;
        }
        const insertedProductImageId = result.insertId;
        resolve(insertedProductImageId);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      dbConn.query("SELECT * FROM product_image", (err, res) => {
        if (err) {
          console.error("Error fetching product images:", err);
          reject(err);
          return;
        }
        const productImages = res.map(productImage => new ProductImage(productImage));
        resolve(productImages);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product_image WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error("Error deleting product image:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product_image', (err, result) => {
        if (err) {
          console.error("Error deleting all product images:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = ProductImage;
