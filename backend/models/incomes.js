const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  recurring: { type: Boolean, default: false }, // Indicates if the income is recurring
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  note: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
