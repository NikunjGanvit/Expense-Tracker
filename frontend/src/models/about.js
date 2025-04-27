import React from 'react';
import { Card } from 'react-bootstrap';

const About = () => {
  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
      <div className="container mt-6 d-flex justify-content-center">
        <Card style={{ width: '60%', maxWidth: '800px' }} className="text-center p-4">
          <Card.Body>
            <Card.Title className="mb-4">
              <h2>About Our Project</h2>
            </Card.Title>
            <Card.Text>
              Welcome to our Expense and Income Tracking application! This project is designed to help you manage your finances efficiently by keeping track of your expenses and income. Whether you are looking to save more, spend wisely, or simply understand where your money goes, our application is here to assist you.
            </Card.Text>
            <Card.Text>
              <strong>About Us:</strong> We are two enthusiastic developers, Akshay Gohel and Nikunj Ganvit. We are passionate about creating solutions that make life easier and more organized. This project was developed as part of our coursework in Computer Engineering at the Dharmsinh Desai Institute of Technology.
            </Card.Text>
            <Card.Text>
              <strong>Technologies Used:</strong> Our application is built using the MERN stack, which includes MongoDB, Express.js, React.js, and Node.js. This combination of technologies allows us to create a robust and scalable application that delivers a seamless user experience.
            </Card.Text>
            <Card.Text>
              We hope you find our application useful and that it helps you take control of your financial journey. Thank you for visiting, and happy tracking!
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default About;
