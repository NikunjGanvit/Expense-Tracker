const mongoose = require('mongoose');

const historyIncomeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  amount: { type: Number, required: true }, // Amount of income
  date: { type: Date, required: true }, // Date when the income was received
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the Category
  description: { type: String, required: false }, // Optional description for the income
  created_at: { type: Date, default: Date.now } // Date when the record was created
});

const HistoryIncome = mongoose.model('HistoryIncome', historyIncomeSchema);

module.exports = HistoryIncome;
