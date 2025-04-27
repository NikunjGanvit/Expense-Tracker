// utils/scheduledTasks.js
const cron = require('node-cron');
const Budget = require('../models/budgets');
const Notification = require('../models/notifications');
const Category=require('../models/categories');
// Function to check and create notifications for expired budgets
const checkExpiredBudgets = async () => {
  try {
    const now = new Date();
    const expiredBudgets = await Budget.find({ end_date: { $lt: now } });

    for (const budget of expiredBudgets) {
      console.log(budget.category);
      const cat=await Category.find({_id:budget.category});
      const notification = new Notification({
        user_id: budget.user_id,
        message: `Your budget for ${cat[0].name} has expired.`,
        read: false,
        budget_id: budget._id
      });

      await notification.save();
    }

    console.log('Notifications created for expired budgets.');
  } catch (error) {
    console.error('Error checking expired budgets:', error);
  }
};

// Schedule the task to run daily at 12:00 am

cron.schedule("00 00 * * *", () => {
  console.log('Checking for expired budgets...');
  checkExpiredBudgets();
});
