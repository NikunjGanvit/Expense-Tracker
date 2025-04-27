const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  description: {
    type: String,
    required: true
  },
  feedbackRating: {
    type: Number,
    required: true,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
