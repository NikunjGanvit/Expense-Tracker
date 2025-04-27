import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import useAuthnticate from './auth/authentication';
const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    amount: '',
    start_date: '',
    end_date: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editBudgetId, setEditBudgetId] = useState(null);
  const isAuthnticate=useAuthnticate();
  useEffect(()=>{
    isAuthnticate();
  });


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await axios.get('http://localhost:8000/category', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredCategories = response.data.filter(
          (category) => category.user_id._id === userId
        );

        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await axios.get('http://localhost:8000/budget', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredBudgets = response.data.filter(
          (budget) => budget.user_id._id === userId
        );

        setBudgets(filteredBudgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchCategories();
    fetchBudgets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({
      ...newBudget,
      [name]: value,
    });
  };

  const handleAddBudget = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      await axios.post(
        'http://localhost:8000/budget',
        { ...newBudget, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get('http://localhost:8000/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredBudgets = response.data.filter(
        (budget) => budget.user_id._id === userId
      );

      setBudgets(filteredBudgets);
      setNewBudget({ amount: '', start_date: '', end_date: '', category: '' });
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleEditBudget = (budgetId) => {
    setEditMode(true);
    setEditBudgetId(budgetId);
    const budgetToEdit = budgets.find((budget) => budget._id === budgetId);
    setNewBudget({
      amount: budgetToEdit.amount,
      start_date: budgetToEdit.start_date.split('T')[0], // Format date to YYYY-MM-DD
      end_date: budgetToEdit.end_date.split('T')[0], // Format date to YYYY-MM-DD
      category: budgetToEdit.category._id,
    });
  };

  const handleUpdateBudget = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      await axios.put(
        `http://localhost:8000/budget/${editBudgetId}`,
        { ...newBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get('http://localhost:8000/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const filteredBudgets = response.data.filter(
        (budget) => budget.user_id._id === userId
      );

      setBudgets(filteredBudgets);
      setNewBudget({ amount: '', start_date: '', end_date: '', category: '' });
      setEditMode(false);
      setEditBudgetId(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      const token = localStorage.getItem('jwtToken');

      await axios.delete(`http://localhost:8000/budget/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get('http://localhost:8000/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const filteredBudgets = response.data.filter(
        (budget) => budget.user_id._id === userId
      );

      setBudgets(filteredBudgets);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
      <div className="container mt-6">
        <h1 className="text-center mb-4">Budget Management</h1>

        {/* New Budget Form */}
        <Card className="mb-3 budget-form-card">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  name="amount"
                  value={newBudget.amount}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={newBudget.start_date}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={newBudget.end_date}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={newBudget.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {editMode ? (
                <Button variant="primary" onClick={handleUpdateBudget}>
                  Update Budget
                </Button>
              ) : (
                <Button variant="success" onClick={handleAddBudget}>
                  Add Budget
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* Budget Cards */}
        {budgets.map((budget) => (
          <Card key={budget._id} className="mb-3 budget-card">
            <Card.Body>
              <Card.Title>
                <strong>Category:</strong> {categories.find((cat) => cat._id === budget.category._id)?.name || 'Unknown'}
              </Card.Title>
              <Card.Text>
                Amount: {budget.amount}
                <br />
                Start Date: {budget.start_date.split('T')[0]}
                <br />
                End Date: {budget.end_date.split('T')[0]}
              </Card.Text>
              <Button variant="warning" className="me-2" onClick={() => handleEditBudget(budget._id)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteBudget(budget._id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .budget-form-card,
        .budget-card {
          width: 50%;
          margin: 0 auto;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Budget;
