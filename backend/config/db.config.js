const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'gestion_tickets_db',
  waitForConnections: true,
  connectionLimit: 10,  // 10 connexions simultanées
  queueLimit: 0
});

module.exports = pool;
