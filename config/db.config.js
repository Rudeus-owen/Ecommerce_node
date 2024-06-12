const mysql = require('mysql');

const dbConn = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: '5899009985myo',
  database: 'ecommerce',
  debug: false
});

dbConn.getConnection(function(err, connection) {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit the application with a non-zero exit code
  } else {
    console.log('Database connected successfully!');
    // Do something with the connection if needed
    // Then release it back to the pool
    connection.release();
  }
});

module.exports = dbConn;

