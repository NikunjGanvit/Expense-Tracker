// routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const incomeController = require('../controller/incomesController');

// Route to create a new income
router.post('/', incomeController.createIncome);

// Route to get all incomes
router.get('/', incomeController.getAllIncomes);

// Route to get income by ID
router.get('/:id', incomeController.getIncomeById);

// Route to update income by ID
router.put('/:id', incomeController.updateIncome);

// Route to delete all incomes
router.delete('/', incomeController.deleteAllIncomes);

router.delete('/:id', incomeController.deleteIncomeById);

module.exports = router;
