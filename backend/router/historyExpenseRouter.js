// routes/historyExpenseRoutes.js
const express = require('express');
const router = express.Router();
const historyExpenseController = require('../controller/historyExpenseController');

// Route to create a new history expense record
router.post('/', historyExpenseController.createHistoryExpense);

// Route to get all history expense records
router.get('/', historyExpenseController.getAllHistoryExpenses);

// Route to get history expense record by ID
router.get('/:id', historyExpenseController.getHistoryExpenseById);

// Route to update history expense record by ID
router.put('/:id', historyExpenseController.updateHistoryExpense);

// Route to delete history expense record by ID
router.delete('/:id', historyExpenseController.deleteHistoryExpenseById);

// Route to delete all history expense records
router.delete('/', historyExpenseController.deleteAllHistoryExpenses);

module.exports = router;
