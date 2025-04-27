// controllers/historyExpenseController.js
const HistoryExpense = require('../models/historyExpense');

// Create a new history expense record
exports.createHistoryExpense = async (req, res) => {
  try {
    const { user_id, amount, date, category, description } = req.body;
    const newHistoryExpense = new HistoryExpense({ user_id, amount, date, category, description });
    await newHistoryExpense.save();
    res.status(201).json({ message: 'History expense created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all history expense records
exports.getAllHistoryExpenses = async (req, res) => {
  try {
    const historyExpenses = await HistoryExpense.find().populate('user_id category');
    res.status(200).json(historyExpenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get history expense record by ID
exports.getHistoryExpenseById = async (req, res) => {
  try {
    const historyExpense = await HistoryExpense.findById(req.params.id).populate('user_id category');
    if (!historyExpense) {
      return res.status(404).json({ message: 'History expense not found' });
    }
    res.status(200).json(historyExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update history expense record by ID
exports.updateHistoryExpense = async (req, res) => {
  try {
    const { amount, date, category, description } = req.body;
    const updatedHistoryExpense = await HistoryExpense.findByIdAndUpdate(
      req.params.id,
      { amount, date, category, description, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedHistoryExpense) {
      return res.status(404).json({ message: 'History expense not found' });
    }
    res.status(200).json(updatedHistoryExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete history expense record by ID
exports.deleteHistoryExpenseById = async (req, res) => {
  try {
    const result = await HistoryExpense.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'History expense not found' });
    }
    res.status(200).json({ message: 'History expense deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all history expense records
exports.deleteAllHistoryExpenses = async (req, res) => {
  try {
    await HistoryExpense.deleteMany();
    res.status(200).json({ message: 'All history expense records deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
