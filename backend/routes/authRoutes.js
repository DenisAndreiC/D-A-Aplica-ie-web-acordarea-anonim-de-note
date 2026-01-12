const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute pentru autentificare
router.post('/register', userController.register);
router.post('/login', userController.login);

// Ruta pentru a vedea toti userii (in scop de test/profesor)
router.get('/users', userController.getAllUsers);

module.exports = router;
