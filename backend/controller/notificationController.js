const Notification = require('../models/notifications');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { user_id, budget_id, message, read } = req.body; // Added budget_id
    const newNotification = new Notification({ user_id, budget_id, message, read });
    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user_id')
      .populate('budget_id'); // Populate budget_id
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('user_id')
      .populate('budget_id'); // Populate budget_id
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const { message, read, budget_id } = req.body; // Added budget_id
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { message, read, budget_id, updated_at: Date.now() }, // Include budget_id
      { new: true, runValidators: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
