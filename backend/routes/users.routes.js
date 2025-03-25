const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

console.log("usersController:", usersController); // Vérifiez dans les logs que deleteUser est défini

// Route d'inscription
router.post('/register', usersController.register);

// Route de connexion
router.post('/login', usersController.login);

// Récupérer tous les utilisateurs
router.get('/', usersController.getAllUsers);

// Supprimer un utilisateur par son ID
router.delete('/:id', usersController.deleteUser);

module.exports = router;
