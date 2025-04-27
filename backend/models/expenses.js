const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  recurring: { type: Boolean, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  note: { type: String },  // Optional field for additional information
  created_at: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
