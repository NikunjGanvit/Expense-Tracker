import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert'; // For notification when deleted successfully

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch notifications based on userId
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      // Fetch notifications from backend with token
      const response = await axios.get('http://localhost:8000/notification', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const allNotifications = response.data;

      // Filter notifications by userId
      const userNotifications = allNotifications.filter(
        (notification) => notification.user_id._id === userId
      );

      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId) => {
    try {
      const token = localStorage.getItem('jwtToken');

      await axios.delete(`http://localhost:8000/notification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Notification deleted successfully.');
      // Remove deleted notification from the UI
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-primary mb-4">Notifications</h1>
      {message && (
        <Alert variant="success" onClose={() => setMessage('')} dismissible>
          {message}
        </Alert>
      )}
      <Row>
        {notifications.length === 0 ? (
          <p>No notifications to display.</p>
        ) : (
          notifications.map((notification) => (
            <Col md={6} lg={4} key={notification._id} className="mb-4">
              <Card className="shadow" border="primary">
                <Card.Body>
                  <Card.Title className="text-primary">{notification.title}</Card.Title>
                  <Card.Text>{notification.message}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(notification._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {new Date(notification.budget_id.end_date).toLocaleString()}
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Notification;
