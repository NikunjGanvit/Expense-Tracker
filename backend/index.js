// index.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const scheduledTasks = require('./utils/scheduledTasks');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();
app.use(cors({
  origin: '*', // Allow requests from any origin (less secure)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import routes
const registerUser=require('./authentication/registration');
const loginUser=require('./authentication/login');
const userRoutes = require('./router/userRouter');
const expenseRoutes = require('./router/expenseRouter'); // Corrected path
const incomeRoutes = require('./router/incomeRouter');
const categoryRoutes = require('./router/categoryRouter'); // Added
const budgetRoutes = require('./router/budgetRouter'); // Added
const notificationRoutes = require('./router/notificationRouter'); // Added
const historyIncomeRoutes = require('./router/historyIncomeRouter');
const historyExpenseRoutes = require('./router/historyExpenseRouter');
const contactUsRoutes = require('./router/contactUsRouter');
const collaborationRoutes = require('./router/collaborationRouter');
const authenticate = require('./middleware/authenticate')
// Use routes
// Routes
app.use('/register', registerUser);
app.use('/login', loginUser);

// Protected Routes (require authentication)
app.use('/user', authenticate, userRoutes);
app.use('/expense', authenticate, expenseRoutes);
app.use('/income', authenticate, incomeRoutes);
app.use('/category', authenticate, categoryRoutes); // Protected
app.use('/budget', authenticate, budgetRoutes); // Protected
app.use('/notification', authenticate, notificationRoutes); // Protected
app.use('/history-income', authenticate, historyIncomeRoutes); // Protected
app.use('/history-expenses', authenticate, historyExpenseRoutes); // Protected
app.use('/contact-us', authenticate, contactUsRoutes); // Protected
app.use('/collaboration', authenticate, collaborationRoutes); // Protected
// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

scheduledTasks;
