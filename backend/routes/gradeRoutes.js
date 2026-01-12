const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/grades -> Adauga nota
router.post('/', authenticateToken, gradeController.addGrade);

// GET /api/grades/:deliverableId -> Vezi notele unui livrabil
router.get('/:deliverableId', authenticateToken, gradeController.getDeliverableGrades);

module.exports = router;