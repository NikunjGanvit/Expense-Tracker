const mongoose = require('mongoose');

// Base64-encoded blank or placeholder image
const defaultProfilePicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/9c4AAAAAElFTkSuQmCC';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  mobileno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  profilePicture: { type: String, default: defaultProfilePicture }, // Base64-encoded image data
  role: { type: String, enum: ['admin', 'user'], default: 'user' } // Role-based access control
});

// Virtual field for _id
userSchema.virtual('userId')
  .get(function() {
    return this._id;
  })
  .set(function(id) {
    this._id = id;
  });

// Make sure to include virtuals when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
