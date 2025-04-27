const bcrypt = require('bcrypt');
const User = require('../models/users'); // Assuming the User model is inside a models directory

// Registration function
const registerUser = async (req, res) => {
  try {
    const { firstName, surname, fullName, gender, mobileno, email, profession, password} = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      surname,
      fullName,
      gender,
      mobileno,
      email,
      profession,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = registerUser;
