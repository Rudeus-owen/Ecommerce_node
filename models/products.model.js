const dbConn = require('../config/db.config');
const QRCode = require('qrcode');

class Products {
  constructor(products) {
    this.id = products.id;
    this.name = products.name;
    this.description = products.description;
    this.category_id = products.category_id;
    this.sub_category_id = products.sub_category_id;
    this.QR_CODE = products.QR_CODE;
  }

  static async create(newProducts) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(`${newProducts.name}-${newProducts.category_id}-${newProducts.sub_category_id}`);
      newProducts.QR_CODE = qrCodeUrl;

      return new Promise((resolve, reject) => {
        dbConn.query(
          'INSERT INTO product (id, name, description, category_id, sub_category_id, QR_CODE) VALUES (?, ?, ?, ?, ?, ?)', 
          [
            newProducts.id,
            newProducts.name,
            newProducts.description,
            newProducts.category_id,
            newProducts.sub_category_id,
            newProducts.QR_CODE,
          ], 
          (err, result) => {
            if (err) {
              console.error("Error creating product:", err);
              reject(err);
              return;
            }
            resolve({ id: newProducts.id, message: "Product created successfully" });
          }
        );
      });
    } catch (err) {
      console.error("Error generating QR code:", err);
      throw err;
    }
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      dbConn.query("SELECT * FROM product", (err, res) => {
        if (err) {
          console.error("Error fetching product:", err);
          reject(err);
          return;
        }
        const products = res.map(product => new Products(product));
        resolve(products);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('SELECT * FROM product WHERE id = ?', [id], (err, res) => {
        if (err) {
          console.error("Error fetching product:", err);
          reject(err);
          return;
        }
        if (res.length) {
          resolve(new Products(res[0]));
        } else {
          resolve(null); // No product found with the given id
        }
      });
    });
  }

  static async updateById(id, updatedProduct) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(`${updatedProduct.name}-${updatedProduct.category_id}-${updatedProduct.sub_category_id}`);
      updatedProduct.QR_CODE = qrCodeUrl;

      return new Promise((resolve, reject) => {
        dbConn.query('UPDATE product SET name = ?, description = ?, category_id = ?, sub_category_id = ?, QR_CODE = ? WHERE id = ?', [
          updatedProduct.name,
          updatedProduct.description,
          updatedProduct.category_id,
          updatedProduct.sub_category_id,
          updatedProduct.QR_CODE,
          id
        ], (err, result) => {
          if (err) {
            console.error("Error updating product:", err);
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    } catch (err) {
      console.error("Error generating QR code:", err);
      throw err;
    }
  }

  static delete(productId) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product WHERE id = ?', [productId], (err, result) => {
        if (err) {
          console.error("Error deleting product:", err);
          reject(err);
          return;
        }
        if (result.affectedRows === 0) {
          reject(new Error("No product found with the provided ID"));
          return;
        }
        resolve({ id: productId, message: "Product deleted successfully" });
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM product', (err, result) => {
        if (err) {
          console.error("Error deleting all products:", err);
          reject(err);
          return;
        }
        resolve({ message: "All products deleted successfully" });
      });
    });
  }
}

module.exports = Products;
