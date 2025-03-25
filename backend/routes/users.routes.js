const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Route d'inscription
router.post('/register', usersController.register);

// Route de connexion
router.post('/login', usersController.login);

module.exports = router;
