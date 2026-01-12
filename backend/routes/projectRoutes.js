const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authMiddleware');

// Rute protejate
router.post('/', authenticateToken, projectController.createProject);
router.get('/my-projects', authenticateToken, projectController.getMyProjects);

// Ruta publica momentan (sau pentru profesor)
router.get('/', projectController.getAllProjects);

module.exports = router;