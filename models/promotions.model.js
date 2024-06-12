const dbConn = require('../config/db.config');

class Promotion {
  constructor(promotion) {
    this.promotion_id = promotion.promotion_id;
    this.promotion_name = promotion.promotion_name;
    this.description = promotion.description;
    this.promotion_type = promotion.promotion_type;
    this.discount_value = promotion.discount_value;
    this.start_date = promotion.start_date;
    this.end_date = promotion.end_date;
    this.status = promotion.status;
    this.conditions = promotion.conditions;
  }

  static create(newPromotion) {
    return new Promise((resolve, reject) => {
      dbConn.query(
        'INSERT INTO promotions (promotion_name, description, promotion_type, discount_value, start_date, end_date, status, conditions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [
          newPromotion.promotion_name,
          newPromotion.description,
          newPromotion.promotion_type,
          newPromotion.discount_value,
          newPromotion.start_date,
          newPromotion.end_date,
          newPromotion.status,
          newPromotion.conditions
        ], 
        (err, result) => {
          if (err) {
            console.error("Error creating promotion:", err);
            reject(err);
            return;
          }
          const insertedPromotionId = result.insertId;
          resolve({ promotion_id: insertedPromotionId, message: "Promotion created successfully" });
        }
      );
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      dbConn.query("SELECT * FROM promotions", (err, res) => {
        if (err) {
          console.error("Error fetching promotions:", err);
          reject(err);
          return;
        }
        const promotions = res.map(promotion => new Promotion(promotion));
        resolve(promotions);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      dbConn.query('SELECT * FROM promotions WHERE promotion_id = ?', [id], (err, res) => {
        if (err) {
          console.error("Error fetching promotion:", err);
          reject(err);
          return;
        }
        if (res.length) {
          resolve(new Promotion(res[0]));
        } else {
          resolve(null); // No promotion found with the given id
        }
      });
    });
  }

  static updateById(id, updatedPromotion) {
    return new Promise((resolve, reject) => {
      dbConn.query('UPDATE promotions SET promotion_name = ?, description = ?, promotion_type = ?, discount_value = ?, start_date = ?, end_date = ?, status = ?, conditions = ? WHERE promotion_id = ?', [
        updatedPromotion.promotion_name,
        updatedPromotion.description,
        updatedPromotion.promotion_type,
        updatedPromotion.discount_value,
        updatedPromotion.start_date,
        updatedPromotion.end_date,
        updatedPromotion.status,
        updatedPromotion.conditions,
        id
      ], (err, result) => {
        if (err) {
          console.error("Error updating promotion:", err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static delete(promotionId) {
    return new Promise((resolve, reject) => {
      dbConn.query('DELETE FROM promotions WHERE promotion_id = ?', [promotionId], (err, result) => {
        if (err) {
          console.error("Error deleting promotion:", err);
          reject(err);
          return;
        }
        if (result.affectedRows === 0) {
          reject(new Error("No promotion found with the provided ID"));
          return;
        }

        // Check if there are any remaining promotions
        dbConn.query('SELECT COUNT(*) AS count FROM promotions', (countErr, countResult) => {
          if (countErr) {
            console.error("Error counting promotions:", countErr);
            reject(countErr);
            return;
          }

          const remainingPromotions = countResult[0].count;
          if (remainingPromotions === 0) {
            // Reset the auto-increment value
            dbConn.query('ALTER TABLE promotions AUTO_INCREMENT = 1', (alterErr) => {
              if (alterErr) {
                console.error("Error resetting auto-increment value:", alterErr);
                reject(alterErr);
                return;
              }
              resolve({ promotion_id: promotionId, message: "Promotion deleted successfully and ID sequence reset" });
            });
          } else {
            resolve({ promotion_id: promotionId, message: "Promotion deleted successfully" });
          }
        });
      });
    });
  }

  static deleteAll() {
    return new Promise((resolve, reject) => {
      // Delete all promotions
      dbConn.query('DELETE FROM promotions', (err, result) => {
        if (err) {
          console.error("Error deleting all promotions:", err);
          reject(err);
          return;
        }
        // Reset the auto-increment value
        dbConn.query('ALTER TABLE promotions AUTO_INCREMENT = 1', (alterErr) => {
          if (alterErr) {
            console.error("Error resetting auto-increment value:", alterErr);
            reject(alterErr);
            return;
          }
          resolve({ message: "All promotions deleted and ID sequence reset" });
        });
      });
    });
  }
}

module.exports = Promotion;
