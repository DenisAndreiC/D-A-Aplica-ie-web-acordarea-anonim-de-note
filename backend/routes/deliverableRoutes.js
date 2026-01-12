const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const authenticateToken = require('../middleware/authMiddleware');

// Post: adauga un livrabil. Body: projectId, resourceUrl, description
router.post('/', authenticateToken, deliverableController.createDeliverable);

// Get: vezi livrabilele unui proiect specific
router.get('/project/:projectId', authenticateToken, deliverableController.getProjectDeliverables);

module.exports = router;