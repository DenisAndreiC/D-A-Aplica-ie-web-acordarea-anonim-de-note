const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authMiddleware');

// rute protejate
router.post('/', authenticateToken, projectController.createProject);
router.get('/my-projects', authenticateToken, projectController.getMyProjects);

// ruta publica momentan (sau pentru profesor)
router.get('/', projectController.getAllProjects);
router.get('/:id', authenticateToken, projectController.getProjectById);

module.exports = router;