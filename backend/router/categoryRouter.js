// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoriesController');

// Route to create a new category
router.post('/', categoryController.createCategory);

// Route to get all categories
router.get('/', categoryController.getAllCategories);

// Route to get category by ID
router.get('/:id', categoryController.getCategoryById);

// Route to update category by ID
router.put('/:id', categoryController.updateCategory);

// Route to delete all categories
router.delete('/', categoryController.deleteAllCategories);

module.exports = router;
