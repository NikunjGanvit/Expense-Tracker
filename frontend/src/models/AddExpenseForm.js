import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

const AddExpenseForm = ({ onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleNoteChange = (e) => setNote(e.target.value);
  const handleRecurringChange = (e) => setRecurring(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not logged in');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const response = await axios.post('http://localhost:8000/expense', {
        user_id: userId,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        category: selectedCategory,
        note,
        recurring
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Expense added successfully:', response.data);
      alert('Data saved successfully!');
      onSuccess(); // Trigger refresh or data refetch
      onClose(); // Close the form after submission
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Button variant="link" onClick={onClose} className="close-button">
          <AiOutlineClose />
        </Button>
      </div>
      <div className="form-content">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="expenseAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter amount" 
              value={amount} 
              onChange={handleAmountChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="expenseCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control 
              as="select" 
              value={selectedCategory} 
              onChange={handleCategoryChange} 
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="expenseDate">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              value={date} 
              onChange={handleDateChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="expenseNote">
            <Form.Label>Note</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Enter note" 
              value={note} 
              onChange={handleNoteChange} 
            />
          </Form.Group>
          <Form.Group controlId="expenseRecurring">
            <Form.Check 
              type="checkbox" 
              label="Recurring" 
              checked={recurring} 
              onChange={handleRecurringChange} 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Expense
          </Button>
          {error && <p className="text-danger">{error}</p>}
        </Form>
      </div>

      <style jsx>{`
        .form-container {
          background-color: #f8f9fa;
          width: 400px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: auto;
        }
        .form-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .close-button {
          color: #6c757d;
        }
        .form-content {
          /* Define styles for form content if needed */
        }
      `}</style>
    </div>
  );
};

export default AddExpenseForm;
