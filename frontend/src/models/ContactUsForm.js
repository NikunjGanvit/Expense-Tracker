import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ContactUsForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    const token = localStorage.getItem('jwtToken');

    try {
      const response = await axios.post('http://localhost:8000/api/contact-us', {
        userName,
        email,
        description,
        feedbackRating
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(response.data.message); // Use the message from the response
      setUserName('');
      setEmail('');
      setDescription('');
      setFeedbackRating(0);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-primary mb-4">Contact Us</h1>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFeedbackRating">
          <Form.Label>Feedback Rating</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="5"
            placeholder="Rate your experience (0-5)"
            value={feedbackRating}
            onChange={(e) => setFeedbackRating(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ContactUsForm;
