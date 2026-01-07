const express = require('express');
const router = express.Router();
const juryController= require('../controllers/juryController');

router.post('/',juryController.assignJury); // post asignare manuala
router.get('/:projectId',juryController.getProjectJury);// get pentru a vedea cine jurizeaza proiectul
module.exports=router;