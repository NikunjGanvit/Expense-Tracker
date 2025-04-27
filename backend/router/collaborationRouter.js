const express = require('express');
const router = express.Router();
const collaborationController = require('../controller/collaborationController');

// Route to create a new collaboration request
router.post('/', collaborationController.createCollaboration);

// Route to get all collaboration requests
router.get('/', collaborationController.getAllCollaborations);

// Route to get collaboration request by ID
router.get('/:id', collaborationController.getCollaborationById);

// Route to update a collaboration request by ID
router.put('/:id', collaborationController.updateCollaboration);

// Route to delete all collaboration requests
router.delete('/', collaborationController.deleteAllCollaborations);

// Route to delete a collaboration request by ID
router.delete('/:id', collaborationController.deleteCollaborationById);

module.exports = router;
