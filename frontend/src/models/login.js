import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import icons from react-icons library
import axios from 'axios'; // Import axios
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [validationMessage, setValidationMessage] = useState(''); // State for validation messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission default action

    if (!email || !password) {
      setValidationMessage('Please fill both email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      
      if (response.status === 200) {
        const { token } = response.data; // Extract JWT token from the response
        localStorage.setItem('jwtToken', token); // Store the token in localStorage
        localStorage.setItem('collaboratingUsers', JSON.stringify([]));

        alert('Login successful');
        navigate('/'); // Redirect to the root URL
      } else {
        setValidationMessage('Login failed');
      }
    } catch (error) {
      setValidationMessage('Login failed');
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#add8e6' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <div className="p-4 rounded-3 bg-white">
            <h2 className="mb-4 text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
              {validationMessage && (
                <p className="text-center text-danger mt-3">{validationMessage}</p>
              )}
             <Link to={"/register"} style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}
             >have not any account, click here</Link>
            </Form>
            
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
