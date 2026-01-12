const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// rute pentru autentificare
router.post('/register', userController.register);
router.post('/login', userController.login);

// ruta pentru a vedea toti userii (test/profesor)
router.get('/users', userController.getAllUsers);

module.exports = router;
