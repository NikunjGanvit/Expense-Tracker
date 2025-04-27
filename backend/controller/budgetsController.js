const Budget = require('../models/budgets'); // Adjust path to match your directory structure

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { user_id, amount, category, end_date, start_date } = req.body;
    const newBudget = new Budget({ 
      user_id, 
      amount, 
      category, 
      end_date, 
      start_date: start_date || Date.now() // Set start_date to provided date or default to now
    });
    await newBudget.save();
    res.status(201).json({ message: 'Budget created successfully!', budget: newBudget });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate('user_id category');
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('user_id category');
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update budget by ID
exports.updateBudget = async (req, res) => {
  try {
    const { amount, category, end_date, start_date } = req.body;
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { amount, category, end_date, start_date, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all budgets
exports.deleteAllBudgets = async (req, res) => {
  try {
    await Budget.deleteMany();
    res.status(200).json({ message: 'All budgets deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete budget by ID
exports.deleteBudgetById = async (req, res) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
