const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budgetsController');

// Route to create a new budget
router.post('/', budgetController.createBudget);

// Route to get all budgets
router.get('/', budgetController.getAllBudgets);

// Route to get budget by ID
router.get('/:id', budgetController.getBudgetById);

// Route to update budget by ID
router.put('/:id', budgetController.updateBudget);

// Route to delete all budgets
router.delete('/', budgetController.deleteAllBudgets);

// Route to delete budget by ID
router.delete('/:id', budgetController.deleteBudgetById);

module.exports = router;
