const Income = require('../models/incomes');
const HistoryIncome = require('../models/historyIncome');

// Create a new income
exports.createIncome = async (req, res) => {
  try {
    const { user_id, amount, date, recurring, note, category } = req.body;
    const newIncome = new Income({ user_id, amount, date, recurring, note, category });
    await newIncome.save();
    res.status(201).json({ message: 'Income created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all incomes
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate('user_id category');
    res.status(200).json(incomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get income by ID
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id).populate('user_id category');
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update income by ID
exports.updateIncome = async (req, res) => {
  try {
    const { amount, date, recurring, note, category } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { amount, date, recurring, note, category },
      { new: true, runValidators: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all incomes
exports.deleteAllIncomes = async (req, res) => {
  try {
    // Fetch all incomes before deleting
    const allIncomes = await Income.find();
    
    // Create history records for all incomes
    const historyRecords = allIncomes.map(income => ({
      user_id: income.user_id,
      amount: income.amount,
      date: income.date,
      category: income.category,
      description: 'Archived before deletion'
    }));
    
    // Save history records
    await HistoryIncome.insertMany(historyRecords);

    // Delete all incomes
    await Income.deleteMany();
    res.status(200).json({ message: 'All incomes deleted and archived successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete income by ID
exports.deleteIncomeById = async (req, res) => {
  try {
    // Fetch the income before deleting
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    // Create a history record for the income
    const historyRecord = new HistoryIncome({
      user_id: income.user_id,
      amount: income.amount,
      date: income.date,
      category: income.category,
      description: 'Archived before deletion'
    });
    
    // Save the history record
    await historyRecord.save();

    // Delete the income
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Income deleted and archived successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
