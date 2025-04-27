const Expense = require('../models/expenses');
const HistoryExpense = require('../models/historyExpense'); // Import the HistoryExpense model

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { user_id, amount, category, date, recurring, note } = req.body;
    const newExpense = new Expense({ user_id, amount, category, date, recurring, note });
    await newExpense.save();
    res.status(201).json({ message: 'Expense created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('user_id category');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('user_id category');
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const { amount, category, date, recurring, note } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount, category, date, recurring, note, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all expenses
exports.deleteAllExpenses = async (req, res) => {
  try {
    // Find all expenses before deleting
    const expenses = await Expense.find();

    // Create history entries for each expense
    const historyExpenses = expenses.map(expense => ({
      user_id: expense.user_id,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.note // Assuming note field as description in HistoryExpense
    }));

    // Save history expenses
    await HistoryExpense.insertMany(historyExpenses);

    // Delete all expenses
    await Expense.deleteMany();

    res.status(200).json({ message: 'All expenses archived and deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete expense by ID
exports.deleteExpenseById = async (req, res) => {
  try {
    // Find the expense before deleting
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Create a history entry for the expense
    const historyExpense = new HistoryExpense({
      user_id: expense.user_id,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.note // Assuming note field as description in HistoryExpense
    });

    await historyExpense.save();

    // Delete the expense
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Expense archived and deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
