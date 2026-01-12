const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definirea rutelor
router.get('/', userController.getAllUsers); // GET /api/users
// router.post('/', userController.createUser); // SCOS PENTRU CA AVEM /api/auth/register

module.exports = router;