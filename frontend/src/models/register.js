import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FiEye, FiEyeOff,  } from 'react-icons/fi';
import axios from 'axios'; // Import axios
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    gender: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    profession: '',
    otherProfession: '',
    createPassword: '',
    confirmPassword: '',
  });

  const [validationMessages, setValidationMessages] = useState({
    firstName: '',
    surname: '',
    gender: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    profession: '',
    otherProfession: '',
    createPassword: '',
    confirmPassword: '',
    general: '',
  });


  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let message = '';
    if (!value) {
      message = `Please fill the ${field} field`;
    } else if (field === 'confirmPassword' && value !== formData.createPassword) {
      message = 'Passwords do not match';
    }
    setValidationMessages((prevMessages) => ({
      ...prevMessages,
      [field]: message,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission default action

    let allValid = true;
    const newValidationMessages = { ...validationMessages };

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const value = formData[field];
      let message = '';

      if (field === 'confirmPassword' && value !== formData.createPassword) {
        message = 'Passwords do not match';
      } else if (!value && field !== 'otherProfession' && field !== 'otp') {
        message = `Please fill the ${field} field`;
      }

      if (message) {
        newValidationMessages[field] = message;
        allValid = false;
      } else {
        newValidationMessages[field] = '';
      }
    });

    // Check if either mobileNumber or email is filled
    if (!formData.mobileNumber && !formData.email) {
      allValid = false;
      newValidationMessages.mobileNumber = 'Please fill either mobile number or email';
      newValidationMessages.email = 'Please fill either mobile number or email';
    }

    if (allValid) {
      try {
        const response = await axios.post('http://localhost:8000/register', {
          firstName: formData.firstName,
          surname: formData.surname,
          fullName: formData.fullName,
          gender: formData.gender,
          mobileno: formData.mobileNumber,
          email: formData.email,
          profession: formData.profession,
          password: formData.createPassword,
        });

        if (response.status === 201) {
          setValidationMessages((prevMessages) => ({
            ...prevMessages,
            general: 'Registration successful',
          }));
          resetForm();
          navigate('/login'); // Redirect to login page
        } else {
          setValidationMessages((prevMessages) => ({
            ...prevMessages,
            general: 'Registration failed',
          }));
        }
      } catch (error) {
        setValidationMessages((prevMessages) => ({
          ...prevMessages,
          general: 'Registration failed',
        }));
        console.error('Error registering:', error);
      }
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        general: 'Invalid OTP or incomplete form',
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      surname: '',
      gender: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      profession: '',
      otherProfession: '',
      createPassword: '',
      confirmPassword: '',
    });
    setValidationMessages({
      firstName: '',
      surname: '',
      gender: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      profession: '',
      otherProfession: '',
      createPassword: '',
      confirmPassword: '',
      general: '',
    });
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'createPassword') {
      setShowCreatePassword(!showCreatePassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

 
  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#add8e6' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <div className="p-4 rounded-3 bg-white">
            <h2 className="mb-4 text-center">Register</h2>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                  {validationMessages.firstName && (
                    <p className="text-danger">{validationMessages.firstName}</p>
                  )}
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                  />
                  {validationMessages.surname && (
                    <p className="text-danger">{validationMessages.surname}</p>
                  )}
                </Col>
              </Row>
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  as="select"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  value={formData.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
                {validationMessages.gender && (
                  <p className="text-danger">{validationMessages.gender}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                {validationMessages.fullName && (
                  <p className="text-danger">{validationMessages.fullName}</p>
                )}
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  />
                 
                  {validationMessages.mobileNumber && (
                    <p className="text-danger">{validationMessages.mobileNumber}</p>
                  )}
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                  Or
                </Col>
                <Col>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                 
                  {validationMessages.email && (
                    <p className="text-danger">{validationMessages.email}</p>
                  )}
                </Col>
              </Row>
              
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  as="select"
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  value={formData.profession}
                >
                  <option value="">Select Profession</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="other">Other</option>
                </Form.Control>
                {validationMessages.profession && (
                  <p className="text-danger">{validationMessages.profession}</p>
                )}
              </Form.Group>
              {formData.profession === 'other' && (
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Specify Profession"
                    value={formData.otherProfession}
                    onChange={(e) => handleInputChange('otherProfession', e.target.value)}
                  />
                  {validationMessages.otherProfession && (
                    <p className="text-danger">{validationMessages.otherProfession}</p>
                  )}
                </Form.Group>
              )}
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  type={showCreatePassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={formData.createPassword}
                  onChange={(e) => handleInputChange('createPassword', e.target.value)}
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y"
                  onClick={() => togglePasswordVisibility('createPassword')}
                >
                  {showCreatePassword ? <FiEyeOff /> : <FiEye />}
                </Button>
                {validationMessages.createPassword && (
                  <p className="text-danger">{validationMessages.createPassword}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
                {validationMessages.confirmPassword && (
                  <p className="text-danger">{validationMessages.confirmPassword}</p>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>
              {validationMessages.general && (
                <p className="text-center text-danger mt-3">{validationMessages.general}</p>
              )}
               <Link to={"/login"} style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}
             >already have an account, click here</Link>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
