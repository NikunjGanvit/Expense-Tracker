// models/historyExpense.js
const mongoose = require('mongoose');

const historyExpenseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const HistoryExpense = mongoose.model('HistoryExpense', historyExpenseSchema);

module.exports = HistoryExpense;
