const express = require('express');
const router = express.Router();
const contactUsController = require('../controller/contactUsController');
const authorization=require("../middleware/authorize")
router.post('/', contactUsController.createContactUs);

// Route to get all contact us entries
router.get('/', authorization("admin"),contactUsController.getAllContactUs);

// Route to get contact us entry by ID
router.get('/:id', authorization("admin"), contactUsController.getContactUsById);

// Route to update contact us entry by ID
router.put('/:id',  authorization("admin"),contactUsController.updateContactUs);

// Route to delete contact us entry by ID
router.delete('/:id', authorization("admin"), contactUsController.deleteContactUsById);

// Route to delete all contact us entries
router.delete('/', authorization("admin"), contactUsController.deleteAllContactUs);
module.exports = router;
