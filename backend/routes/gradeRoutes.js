const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authenticateToken = require('../middleware/authMiddleware');

// adauga nota
router.post('/', authenticateToken, gradeController.addGrade);

// vezi notele unui livrabil
router.get('/:deliverableId', authenticateToken, gradeController.getDeliverableGrades);

// calculeaza media
router.get('/project/:projectId/average', gradeController.getProjectAverage);

module.exports = router;