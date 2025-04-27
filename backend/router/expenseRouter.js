// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expensesController');

// Route to create a new expense
router.post('/', expenseController.createExpense);

// Route to get all expenses
router.get('/', expenseController.getAllExpenses);

// Route to get expense by ID
router.get('/:id', expenseController.getExpenseById);

// Route to update expense by ID
router.put('/:id', expenseController.updateExpense);

// Route to delete all expenses
router.delete('/', expenseController.deleteAllExpenses);

router.delete('/:id', expenseController.deleteExpenseById);
module.exports = router;
