const express = require('express');
const router = express.Router();
const historyIncomeController = require('../controller/historyIncomeController'); // Adjust the path if needed

// Route to create a new history income record
router.post('/', historyIncomeController.createHistoryIncome);

// Route to get all history income records
router.get('/', historyIncomeController.getAllHistoryIncomes);

// Route to get a specific history income record by ID
router.get('/:id', historyIncomeController.getHistoryIncomeById);

// Route to update a specific history income record by ID
router.put('/:id', historyIncomeController.updateHistoryIncome);

// Route to delete a specific history income record by ID
router.delete('/:id', historyIncomeController.deleteHistoryIncomeById);

// Route to delete all history income records
router.delete('/', historyIncomeController.deleteAllHistoryIncomes);

module.exports = router;
