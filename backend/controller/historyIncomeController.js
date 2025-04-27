const HistoryIncome = require('../models/historyIncome');

// Create a new history income record
exports.createHistoryIncome = async (req, res) => {
  try {
    const { user_id, amount, date, category, description } = req.body;
    const newHistoryIncome = new HistoryIncome({ user_id, amount, date, category, description });
    await newHistoryIncome.save();
    res.status(201).json({ message: 'History income created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all history income records
exports.getAllHistoryIncomes = async (req, res) => {
  try {
    const historyIncomes = await HistoryIncome.find().populate('user_id category');
    res.status(200).json(historyIncomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get history income record by ID
exports.getHistoryIncomeById = async (req, res) => {
  try {
    const historyIncome = await HistoryIncome.findById(req.params.id).populate('user_id category');
    if (!historyIncome) {
      return res.status(404).json({ message: 'History income not found' });
    }
    res.status(200).json(historyIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update history income record by ID
exports.updateHistoryIncome = async (req, res) => {
  try {
    const { amount, date, category, description } = req.body;
    const updatedHistoryIncome = await HistoryIncome.findByIdAndUpdate(
      req.params.id,
      { amount, date, category, description, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedHistoryIncome) {
      return res.status(404).json({ message: 'History income not found' });
    }
    res.status(200).json(updatedHistoryIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete history income record by ID
exports.deleteHistoryIncomeById = async (req, res) => {
  try {
    const result = await HistoryIncome.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'History income not found' });
    }
    res.status(200).json({ message: 'History income deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all history income records
exports.deleteAllHistoryIncomes = async (req, res) => {
  try {
    await HistoryIncome.deleteMany();
    res.status(200).json({ message: 'All history income records deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
