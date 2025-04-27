import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const History = () => {
  const [incomeCategory, setIncomeCategory] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [currentIncomePage, setCurrentIncomePage] = useState(1);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [itemsPerPage] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        // Retrieve user IDs from localStorage
        const collaboratingUserIds = JSON.parse(localStorage.getItem('collaboratingUsers')) || [];
        
        // Fetch categories
        const categoryResponse = await axios.get('http://localhost:8000/category', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userCategories = categoryResponse.data.filter((category) => category.user_id._id === userId||collaboratingUserIds.includes(category.user_id._id));
        setCategories(userCategories);

        // Fetch income data
        const incomeResponse = await axios.get('http://localhost:8000/history-income', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allIncomeData = incomeResponse.data.filter(income => collaboratingUserIds.includes(income.user_id._id)||income.user_id._id===userId);
        setIncomeData(allIncomeData);

        // Fetch expense data
        const expenseResponse = await axios.get('http://localhost:8000/history-expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(expenseResponse.data);
        const allExpenseData = expenseResponse.data.filter(expense => collaboratingUserIds.includes(expense.user_id._id)||expense.user_id._id===userId);
        setExpenseData(allExpenseData);

        // Initialize filtered data
        setFilteredIncome(allIncomeData);
        setFilteredExpense(allExpenseData);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [incomeCategory, expenseCategory]); // Include dependencies to filter when categories change

  const filterData = () => {
    const filteredIncome = incomeData.filter(income => 
      incomeCategory ? income.category._id === incomeCategory : true
    );
    const filteredExpense = expenseData.filter(expense => 
      expenseCategory ? expense.category._id === expenseCategory : true
    );
    setFilteredIncome(filteredIncome);
    setFilteredExpense(filteredExpense);
  };

  const handleIncomeCategoryChange = (event) => {
    setIncomeCategory(event.target.value);
  };

  const handleExpenseCategoryChange = (event) => {
    setExpenseCategory(event.target.value);
  };

  const totalIncome = filteredIncome.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = filteredExpense.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpense;
  const profitOrLoss = balance > 0 ? 'Profit' : balance < 0 ? 'Loss' : 'No Profit, No Loss';
  const profitOrLossClass = balance > 0 ? 'text-success' : balance < 0 ? 'text-danger' : 'text-warning';

  // Pagination for income data
  const startIncomeIndex = (currentIncomePage - 1) * itemsPerPage;
  const paginatedIncomeData = filteredIncome.slice(startIncomeIndex, startIncomeIndex + itemsPerPage);
  const totalIncomePages = Math.ceil(filteredIncome.length / itemsPerPage);

  // Pagination for expense data
  const startExpenseIndex = (currentExpensePage - 1) * itemsPerPage;
  const paginatedExpenseData = filteredExpense.slice(startExpenseIndex, startExpenseIndex + itemsPerPage);
  const totalExpensePages = Math.ceil(filteredExpense.length / itemsPerPage);

  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
      <h1 className="text-center mt-4 mb-4">History</h1>

      <div className="d-flex justify-content-around mb-4">
        {/* Income Section */}
        <div className="box-container">
          <h2 className="text-center">Income</h2>
          <Form className="d-flex mb-3">
            <Form.Control
              as="select"
              value={incomeCategory}
              onChange={handleIncomeCategoryChange}
              className="me-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form>
          {paginatedIncomeData.map((income) => (
            <Card key={income._id} className="mb-3">
              <Card.Body>
                <Card.Title>Income</Card.Title>
                <Card.Text>
                  Amount: {income.amount}<br />
                  Date: {new Date(income.date).toLocaleDateString()}<br />
                  Category: {income.category.name}<br />
                  Description: {income.description || 'No Description'}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
          <div>
            {Array.from({ length: totalIncomePages }, (_, index) => (
              <Button
                key={index + 1}
                variant="secondary"
                onClick={() => setCurrentIncomePage(index + 1)}
                disabled={currentIncomePage === index + 1}
                style={{ marginRight: '5px' }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Expense Section */}
        <div className="box-container">
          <h2 className="text-center">Expense</h2>
          <Form className="d-flex mb-3">
            <Form.Control
              as="select"
              value={expenseCategory}
              onChange={handleExpenseCategoryChange}
              className="me-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form>
          {paginatedExpenseData.map((expense) => (
            <Card key={expense._id} className="mb-3">
              <Card.Body>
                <Card.Title>Expense</Card.Title>
                <Card.Text>
                  Amount: {expense.amount}<br />
                  Date: {new Date(expense.date).toLocaleDateString()}<br />
                  Category: {expense.category.name}<br />
                  Description: {expense.description || 'No Description'}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
          <div>
            {Array.from({ length: totalExpensePages }, (_, index) => (
              <Button
                key={index + 1}
                variant="secondary"
                onClick={() => setCurrentExpensePage(index + 1)}
                disabled={currentExpensePage === index + 1}
                style={{ marginRight: '5px' }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-container text-center mt-4">
        <h3>Total Income: ${totalIncome}</h3>
        <h3>Total Expense: ${totalExpense}</h3>
        <h3>Balance: ${balance}</h3>
        <h3 className={profitOrLossClass}>{profitOrLoss}</h3>
      </div>

      {/* CSS for styling */}
      <style jsx>{`
        .box-container {
          width: 45%;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .summary-container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default History;
