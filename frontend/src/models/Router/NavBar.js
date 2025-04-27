import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  // Check if user is logged in by looking for JWT token in localStorage
  const isLoggedIn = !!localStorage.getItem('jwtToken');

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('jwtToken');
    // Optionally redirect to login page
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            {/* Conditionally render "Home" link */}
            {isLoggedIn && (
              <Nav.Link as={NavLink} to="/" exact>
                Home
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/about">
              About us
            </Nav.Link>
            {/* Conditionally render other links based on login status */}
            {!isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Sign up
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Sign in
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/budget">
                  Budget
                </Nav.Link>
                <Nav.Link as={NavLink} to="/history">
                  History
                </Nav.Link>
                <Nav.Link as={NavLink} to="/colobaration">
                  Collaboration
                </Nav.Link>
                {/* Notification Link */}
                <Nav.Link as={NavLink} to="/notification">
                  Notifications
                </Nav.Link>
                {/* Contact Us Link */}
                <Nav.Link as={NavLink} to="/contact">
                  Contact Us
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Right-aligned items */}
          {isLoggedIn && (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/profile">
                Profile
              </Nav.Link>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="ms-3"
              >
                Logout
              </Button>
            </Nav>
          )}
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
};

export default NavBar;
