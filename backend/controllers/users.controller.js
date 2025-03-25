const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clé secrète pour JWT (à stocker dans une variable d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

// Inscription d'un nouvel utilisateur
exports.register = (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;

  // Hasher le mot de passe
  bcrypt.hash(mot_de_passe, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors du hash du mot de passe' });
    }
    const sql = `INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nom, email, hash, role || 'Employ'], (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
      }
      res.status(201).json({ message: 'Utilisateur inscrit avec succès', id: result.insertId });
    });
  });
};

// Connexion d'un utilisateur
exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const user = results[0];
    // Comparer le mot de passe fourni avec le hash stocké
    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      // Générer un token JWT valable 1 heure
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: 'Connexion réussie', token });
    });
  });
};
