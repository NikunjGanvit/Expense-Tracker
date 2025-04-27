const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  start_date: { type: Date, default: Date.now, required: true },
  end_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
