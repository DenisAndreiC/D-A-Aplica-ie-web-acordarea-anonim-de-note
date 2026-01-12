const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const authenticateToken = require('../middleware/authMiddleware');

// adauga un livrabil (body: projectid, resourceurl, description)
router.post('/', authenticateToken, deliverableController.createDeliverable);

// vezi livrabilele unui proiect specific
router.get('/project/:projectId', authenticateToken, deliverableController.getProjectDeliverables);

module.exports = router;