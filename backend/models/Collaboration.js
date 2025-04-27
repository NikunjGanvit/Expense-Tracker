const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  requested_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesting_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accepted: { type: Boolean, default: false },
  dateTime: { type: Date, default: Date.now } // Default to current date and time
});

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

module.exports = Collaboration;
