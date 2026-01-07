const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.post('/',gradeController.addGrade); 
router.get('/:deliverableId',gradeController.getDeliverableGrades);
module.exports=router;