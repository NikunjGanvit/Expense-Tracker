const User = require('../models/users');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, surname, fullName, gender, mobileno, email, profession, password, profilePicture } = req.body;
    const newUser = new User({
      firstName,
      surname,
      fullName,
      gender,
      mobileno,
      email,
      profession,
      password,
      profilePicture // Handle Base64 image data
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { firstName, surname, fullName, gender, mobileno, email, profession, password, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        surname,
        fullName,
        gender,
        mobileno,
        email,
        profession,
        password,
        profilePicture // Update with Base64 image data
      },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: 'All users deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
