const mysql = require('mysql2');

function connectWithRetry() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_DATABASE || 'gestion_tickets_db'
  });

  db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données, nouvelle tentative dans 5 secondes...', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connecté à la base de données MySQL !');
    }
  });

  return db;
}

const db = connectWithRetry();
module.exports = db;
