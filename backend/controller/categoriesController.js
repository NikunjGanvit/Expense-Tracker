const Category = require('../models/categories'); // Adjust path to match your directory structure

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, user_id } = req.body; // Include user_id
    const newCategory = new Category({ name, user_id });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('user_id'); // Populate user_id
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('user_id'); // Populate user_id
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, user_id } = req.body; // Include user_id
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, user_id }, // Update user_id
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all categories
exports.deleteAllCategories = async (req, res) => {
  try {
    await Category.deleteMany();
    res.status(200).json({ message: 'All categories deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
