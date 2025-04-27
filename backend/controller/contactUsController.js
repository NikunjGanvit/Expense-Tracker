const ContactUs = require('../models/contactUs');

// Create a new contact us entry
exports.createContactUs = async (req, res) => {
  try {
    const { userName, email, description, feedbackRating } = req.body;
    const newContactUs = new ContactUs({ userName, email, description, feedbackRating });
    await newContactUs.save();
    res.status(201).json({ message: 'Contact Us entry created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all contact us entries
exports.getAllContactUs = async (req, res) => {
  try {
    const contactUsEntries = await ContactUs.find();
    res.status(200).json(contactUsEntries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get contact us entry by ID
exports.getContactUsById = async (req, res) => {
  try {
    const contactUs = await ContactUs.findById(req.params.id);
    if (!contactUs) {
      return res.status(404).json({ message: 'Contact Us entry not found' });
    }
    res.status(200).json(contactUs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update contact us entry by ID
exports.updateContactUs = async (req, res) => {
  try {
    const { userName, email, description, feedbackRating } = req.body;
    const updatedContactUs = await ContactUs.findByIdAndUpdate(
      req.params.id,
      { userName, email, description, feedbackRating, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedContactUs) {
      return res.status(404).json({ message: 'Contact Us entry not found' });
    }
    res.status(200).json(updatedContactUs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete contact us entry by ID
exports.deleteContactUsById = async (req, res) => {
  try {
    const result = await ContactUs.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Contact Us entry not found' });
    }
    res.status(200).json({ message: 'Contact Us entry deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all contact us entries
exports.deleteAllContactUs = async (req, res) => {
  try {
    await ContactUs.deleteMany();
    res.status(200).json({ message: 'All Contact Us entries deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
