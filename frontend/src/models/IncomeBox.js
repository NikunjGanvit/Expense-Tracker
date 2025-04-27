import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const IncomeBox = (props) => {
  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [editingIncome, setEditingIncome] = useState(null); // State to handle editing
  const [updatedIncome, setUpdatedIncome] = useState({
    category: '',
    amount: '',
    date: '',
    note: '',
    recurring: false,
  });

  useEffect(() => {
    fetchIncomeData();
    fetchCategories();
  }, [props.refresh]);

  const fetchIncomeData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not logged in');
        return;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const response = await axios.get('http://localhost:8000/income', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const allIncomeData = response.data;

      const userIncomeData = allIncomeData.filter((item) => item.user_id._id === userId);
      setIncomeData(userIncomeData);
    } catch (error) {
      setError('Failed to fetch income data');
      console.error('Error fetching income data:', error);
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

  const handleEdit = (income) => {
    setEditingIncome(income._id);
    setUpdatedIncome({
      category: income.category._id || '', // Assuming category is an object with _id
      amount: income.amount || '',
      date: income.date ? new Date(income.date).toISOString().split('T')[0] : '',
      note: income.note || '',
      recurring: income.recurring || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://localhost:8000/income/${editingIncome}`, updatedIncome, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After updating, refetch the income data
      fetchIncomeData();
      setEditingIncome(null); // Close the form
    } catch (error) {
      setError('Failed to update income');
      console.error('Error updating income:', error);
    }
  };

  const handleDelete = async (incomeId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8000/income/${incomeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After deleting, fetch the updated income data
      fetchIncomeData();
    } catch (error) {
      setError('Failed to delete income');
      console.error('Error deleting income:', error);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncomeData = incomeData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(incomeData.length / itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Income</h2>

      <Form.Group controlId="itemsPerPageSelect" style={{ marginBottom: '10px' }}>
        <Form.Label>Items per page:</Form.Label>
        <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Form.Control>
      </Form.Group>

      {paginatedIncomeData.length > 0 ? (
        paginatedIncomeData.map((item) => (
          <Card key={item._id} style={{ width: '18rem', marginBottom: '10px' }}>
            <Card.Body>
              {editingIncome === item._id ? (
                <Form>
                  <Form.Group controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={updatedIncome.category}
                      onChange={(e) => setUpdatedIncome({ ...updatedIncome, category: e.target.value })}
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
                      value={updatedIncome.amount}
                      onChange={(e) => setUpdatedIncome({ ...updatedIncome, amount: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={updatedIncome.date}
                      onChange={(e) => setUpdatedIncome({ ...updatedIncome, date: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formNote">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      type="text"
                      value={updatedIncome.note}
                      onChange={(e) => setUpdatedIncome({ ...updatedIncome, note: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formRecurring">
                    <Form.Check
                      type="checkbox"
                      label="Recurring"
                      checked={updatedIncome.recurring}
                      onChange={(e) => setUpdatedIncome({ ...updatedIncome, recurring: e.target.checked })}
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
        <p>No income data available</p>
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

export default IncomeBox;
