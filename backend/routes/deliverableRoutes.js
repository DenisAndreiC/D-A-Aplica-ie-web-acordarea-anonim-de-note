const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');

//post: adauga un livrabil body: projectid, resourceurl, description
router.post('/',deliverableController.createDeliverable);
//get : vezi livreabilele unui proiect specific, ex;API/deliverables/project
router.get('project/:projectId',deliverableController.getProjectDeliverables);
module.exports=router;