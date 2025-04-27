import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai'; // Import close icon from react-icons
import axios from 'axios'; // Import axios for making HTTP requests

const AddIncomeForm = ({ onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [error, setError] = useState(''); // State to store any error message

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

        // Filter categories to only those that match the logged-in user's user_id
        const filteredCategories = response.data.filter(category => category.user_id._id === userId);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleRecurringChange = (e) => {
    setRecurring(e.target.checked);
  };

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

      const response = await axios.post('http://localhost:8000/income', {
        user_id: userId,
        amount: parseFloat(amount), // Convert amount to a number
        date: new Date(date).toISOString(), // Convert date to ISO string
        category: selectedCategory,
        note,
        recurring
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Income added successfully:', response.data);
      onSuccess();
      onClose(); // Close the form after submission
    } catch (error) {
      console.error('Error adding income:', error);
      setError('Failed to add income');
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
          <Form.Group controlId="incomeAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter amount" 
              value={amount} 
              onChange={handleAmountChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="incomeCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control 
              as="select" 
              value={selectedCategory} 
              onChange={handleCategoryChange} 
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="incomeDate">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              value={date} 
              onChange={handleDateChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="incomeNote">
            <Form.Label>Note</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Enter note" 
              value={note} 
              onChange={handleNoteChange} 
            />
          </Form.Group>
          <Form.Group controlId="incomeRecurring">
            <Form.Check 
              type="checkbox" 
              label="Recurring" 
              checked={recurring} 
              onChange={handleRecurringChange} 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Income
          </Button>
          {error && <p className="text-danger">{error}</p>} {/* Display error message if any */}
        </Form>
      </div>

      {/* CSS for Form */}
      <style jsx>{`
        .form-container {
          background-color: #f8f9fa; /* Light gray background */
          width: 400px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: auto; /* Center the form */
        }
        .form-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .close-button {
          color: #6c757d; /* Gray close button */
        }
        .form-content {
          /* Define styles for form content if needed */
        }
      `}</style>
    </div>
  );
};

export default AddIncomeForm;
