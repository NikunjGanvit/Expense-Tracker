import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ExpenseBox = (props) => {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [editingExpense, setEditingExpense] = useState(null); // State to handle editing
  const [updatedExpense, setUpdatedExpense] = useState({
    category: '',
    amount: '',
    date: '',
    note: '',
    recurring: false,
  });

  useEffect(() => {
    fetchExpenseData();
    fetchCategories();
  }, [props.refresh]);

  const fetchExpenseData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not logged in');
        return;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const response = await axios.get('http://localhost:8000/expense', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const allExpenseData = response.data;

      const userExpenseData = allExpenseData.filter((item) => item.user_id._id === userId);
      setExpenseData(userExpenseData);
    } catch (error) {
      setError('Failed to fetch expense data');
      console.error('Error fetching expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not logged in');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const response = await axios.get('http://localhost:8000/category', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const filteredCategories = response.data.filter(category => category.user_id._id === userId);
      setCategories(filteredCategories);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense._id);
    setUpdatedExpense({
      category: expense.category._id || '', // Assuming category is an object with _id
      amount: expense.amount || '',
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      note: expense.note || '',
      recurring: expense.recurring || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://localhost:8000/expense/${editingExpense}`, updatedExpense, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After updating, refetch the expense data
      fetchExpenseData();
      setEditingExpense(null); // Close the form
    } catch (error) {
      setError('Failed to update expense');
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8000/expense/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After deleting, fetch the updated expense data
      fetchExpenseData();
    } catch (error) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', error);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenseData = expenseData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(expenseData.length / itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Expenses</h2>

      <Form.Group controlId="itemsPerPageSelect" style={{ marginBottom: '10px' }}>
        <Form.Label>Items per page:</Form.Label>
        <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Form.Control>
      </Form.Group>

      {paginatedExpenseData.length > 0 ? (
        paginatedExpenseData.map((item) => (
          <Card key={item._id} style={{ width: '18rem', marginBottom: '10px' }}>
            <Card.Body>
              {editingExpense === item._id ? (
                <Form>
                  <Form.Group controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={updatedExpense.category}
                      onChange={(e) => setUpdatedExpense({ ...updatedExpense, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={updatedExpense.amount}
                      onChange={(e) => setUpdatedExpense({ ...updatedExpense, amount: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={updatedExpense.date}
                      onChange={(e) => setUpdatedExpense({ ...updatedExpense, date: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formNote">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      type="text"
                      value={updatedExpense.note}
                      onChange={(e) => setUpdatedExpense({ ...updatedExpense, note: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formRecurring">
                    <Form.Check
                      type="checkbox"
                      label="Recurring"
                      checked={updatedExpense.recurring}
                      onChange={(e) => setUpdatedExpense({ ...updatedExpense, recurring: e.target.checked })}
                    />
                  </Form.Group>

                  <Button variant="secondary" onClick={handleCancelEdit} style={{ marginRight: '5px' }}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                </Form>
              ) : (
                <>
                  <Card.Title>{typeof item.category.name === 'string' ? item.category.name : 'Unknown Category'}</Card.Title>
                  <Card.Text>
                    <strong>Amount:</strong> ${typeof item.amount === 'number' ? item.amount : 'N/A'}<br />
                    <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}<br />
                    <strong>Note:</strong> {typeof item.note === 'string' ? item.note : 'No note'}<br />
                    <strong>Recurring:</strong> {typeof item.recurring === 'boolean' ? (item.recurring ? 'Yes' : 'No') : 'N/A'}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                </>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No expense data available</p>
      )}

      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            variant="secondary"
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
            style={{ marginRight: '5px' }}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExpenseBox;
