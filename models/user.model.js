const dbConn = require('../config/db.config')
var bcrypt = require("bcryptjs");

class User {
    constructor(user) {
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.account_expiration_date = user.account_expiration_date;
    }
    static create(user, result) {

        let expirationDate = null;
    if (user.expiration_duration && user.expiration_unit) {
        expirationDate = User.calculateExpirationDate(user.expiration_duration, user.expiration_unit);
    }
        const userData = {
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            created_at: new Date(),
            updated_at: new Date(),
            account_expiration_date:  expirationDate
        };

        dbConn.query("INSERT INTO users set ?", userData, function (err, res) {
            if (err) {
                result(err, null);
            }
            else {
                result(null, res.insertId);
            }
        });
    }

    static async findByUser(username, email) {
        return new Promise((resolve, reject) => {
            dbConn.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, res) => {
                if (err) {
                    console.error("Error retrieving user by username or email:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

    static async create(newUser) {
        return new Promise((resolve, reject) => {
            dbConn.query("INSERT INTO users SET ?", newUser, (err, res) => {
                if (err) {
                    console.error("Error creating user:", err);
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }
    
    // static calculateExpirationDate() {
    //     const expirationDate = new Date();
    //     expirationDate.setDate(expirationDate.getDate() + 30); // Example: Set expiration date to 30 days from now
    //     return expirationDate;
    // }
    
   
    static calculateExpirationDate(duration, unit) {
        // Return null if duration or unit is not provided, preventing further processing
        if (!duration || !unit) {
            return null;
        }
    
        const expirationDate = new Date();
        // Convert unit to lowercase safely
        const unitLower = unit.toLowerCase();
    
        switch (unitLower) {
            case 'days':
                expirationDate.setDate(expirationDate.getDate() + duration);
                break;
            case 'months':
                expirationDate.setMonth(expirationDate.getMonth() + duration);
                break;
            case 'years':
                expirationDate.setFullYear(expirationDate.getFullYear() + duration);
                break;
            default:
                throw new Error("Invalid unit. Use 'days', 'months', or 'years'.");
        }
        return expirationDate.toISOString().slice(0, 10); // Format to YYYY-MM-DD
    }
    

  static async deleteExpiredAccounts() {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

    return new Promise((resolve, reject) => {
      dbConn.query("DELETE FROM users WHERE account_expiration_date < ?", [currentDate], (err, res) => {
        if (err) {
          console.error("Error deleting expired accounts:", err);
          reject(err);
        } else {
          console.log("Deleted expired accounts:", res.affectedRows);
          resolve(res.affectedRows);
        }
      });
    });
  }

static async findAllRegularUsers() {
    return new Promise((resolve, reject) => {
        dbConn.query("SELECT * FROM users WHERE role IS NULL OR role != 1", (err, res) => {
            if (err) {
                console.error("Error retrieving regular users:", err);
                reject(err);
                return;
            }

            resolve(res);
        });
    });
}

static async findAllAdmin() {
    return new Promise((resolve, reject) => {
        dbConn.query("SELECT * FROM users WHERE role = 'admin' OR role = '1'", (err, res) => {
            if (err) {
                console.error("Error retrieving admin users:", err);
                reject(err);
                return;
            }

            resolve(res);
        });
    });
}


static async findById(id) {
    return new Promise((resolve, reject) => {
        dbConn.query("SELECT * FROM users WHERE id = ?", id, (err, res) => {
            if (err) {
                console.error("Error retrieving user by ID:", err);
                reject(err);
                return;
            }

            if (res.length === 0) {
                // If no user is found with the specified ID, resolve with null
                resolve(null);
            } else {
                // Otherwise, resolve with the first user in the result array
                resolve(res[0]);
            }
        });
    });
}

static async findByUserName(username,) {
    return new Promise((resolve, reject) => {
      dbConn.query(`SELECT * FROM users WHERE username = '${username}'`, (err, res) => {
        if (err) {
          console.error("Error retrieving user by username:", err);
          reject(err);
          return;
        }
  
        if (res.length === 0) {
          resolve(null);
        } else {
          resolve(res[0]);
        }
      });
    });
  }

    static verifyUser(email, result) {
        const query = `SELECT * from users where email= '${email}' `;

        dbConn.query(query, (err, res) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }

    static async findByIdAndUpdate(id, newData) {
        return new Promise((resolve, reject) => {
            dbConn.query("UPDATE users SET ? WHERE id = ?", [newData, id], (err, res) => {
                if (err) {
                    console.error("Error updating user by ID:", err);
                    reject(err);
                    return;
                }
                
                // Check if any rows were affected by the update
                if (res.affectedRows === 0) {
                    // If no rows were affected, resolve with null
                    resolve(null);
                } else {
                    // Otherwise, resolve with the updated user object
                    resolve(newData);
                }
            });
        });
    }
    
    static async updatePassword(id, newPassword) {
        if (!newPassword) {
          throw new Error("New password cannot be null or empty.");
        }
      
        return new Promise((resolve, reject) => {
          // Include the WHERE clause in the SQL query string
          dbConn.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, id], (err, res) => {
            if (err) {
              console.error("Error updating user password:", err);
              reject(err);
              return;
            }
      
          
            if (res.affectedRows === 0) {
              resolve(null);
            } else {
              resolve();
            }
          });
        });
      }

      static async findByIdAndDelete(id) {
        return new Promise((resolve, reject) => {
            dbConn.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
                if (err) {
                    console.error("Error deleting user by ID:", err);
                    reject(err);
                    return;
                }
                
                
                if (res.affectedRows === 0) {
                    resolve(null);
                } else {
                    resolve({ message: 'User deleted successfully' });
                }
            });
        });
    }
    
    static async deleteAll() {
        return new Promise((resolve, reject) => {
            dbConn.query("DELETE FROM users", (err, res) => {
                if (err) {
                    console.error("Error deleting all users:", err);
                    reject(err);
                    return;
                }
    
                // Reset the auto-increment value for the 'id' column
                dbConn.query(" TRUNCATE TABLE users", (err, res) => {
                    if (err) {
                        console.error("Error resetting auto-increment:", err);
                        reject(err);
                        return;
                    }
    
                    // Check if any rows were affected by the deletion
                    if (res.affectedRows === 0) {
                        // If no rows were affected, resolve with null
                        resolve(null);
                    } else {
                        // Otherwise, resolve with a success message or any other relevant data
                        resolve({ message: 'All users deleted and ID reset successfully' });
                    }
                });
            });
        });
    }
    
}
module.exports = User