// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

// Route to create a new notification
router.post('/', notificationController.createNotification);

// Route to get all notifications
router.get('/', notificationController.getAllNotifications);

// Route to get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Route to update notification by ID
router.put('/:id', notificationController.updateNotification);

// Route to delete notification by ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
