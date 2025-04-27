import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    rating: 0,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);

  useEffect(() => {
    const fetchContactDetails = async () => {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('jwtToken');

      try {
        const response = await axios.get('http://localhost:8000/contact-us/', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        console.log(response.data);
        setContactDetails(response.data);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      }
    };

    if (showDetails) {
      fetchContactDetails();
    }
  }, [showDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the JWT token from localStorage
    const token = localStorage.getItem('jwtToken');

    try {
      // Send form data to the backend
      const response = await axios.post('http://localhost:8000/contact-us', {
        userName: formData.username,
        email: formData.email,
        description: formData.description,
        feedbackRating: formData.rating,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      });

      setSuccess(response.data.message); // Use the message from the response
      setError('');
      // Clear the form fields
      setFormData({
        username: '',
        email: '',
        description: '',
        rating: 0,
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
      setSuccess('');
    }
  };

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
      <h1 className="text-center mt-4 mb-4">Contact Us</h1>
      <div className="d-flex justify-content-center">
        <div className="box-container">
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your problem or feedback"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRating">
              <Form.Label>Feedback Rating</Form.Label>
              <div className="d-flex justify-content-around">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    color={star <= formData.rating ? '#ffc107' : '#e4e5e9'}
                    onClick={() => handleRatingChange(star)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          <Button variant="secondary" onClick={toggleShowDetails} className="mt-3">
            {showDetails ? 'Hide Contact Details' : 'Show Contact Details'}
          </Button>

          {showDetails && (
            <div className="mt-4">
              <h3>Contact Details</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {contactDetails.map((contact, index) => (
                    <tr key={index}>
                      <td>{contact.userName}</td>
                      <td>{contact.email}</td>
                      <td>{contact.description}</td>
                      <td>{contact.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* CSS for styling */}
      <style jsx>{`
        .box-container {
          width: 50%;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Contact;
