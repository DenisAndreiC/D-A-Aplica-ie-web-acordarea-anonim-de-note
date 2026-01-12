const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, juryController.assignJury); // post asignare manuala
router.post('/auto-assign', authenticateToken, juryController.autoAssignJury); // alocare automata
router.get('/my-jury-projects', authenticateToken, juryController.getJuryProjects); // proiectele unde sunt jurat
router.get('/:projectId', authenticateToken, juryController.getProjectJury); // get pentru a vedea cine jurizeaza proiectul

module.exports = router;