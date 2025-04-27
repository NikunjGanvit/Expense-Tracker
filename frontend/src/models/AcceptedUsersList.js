import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FaUserCheck } from 'react-icons/fa';
import axios from 'axios';

const AcceptedUsersList = () => {
  const [acceptedUsers, setAcceptedUsers] = useState([]);

  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await axios.get('http://localhost:8000/collaboration/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredUsers = response.data.filter(
          (request) => request.requesting_user._id === userId && request.accepted
        );

        setAcceptedUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching accepted users:', error);
      }
    };

    fetchAcceptedUsers();
    
    // Set up an interval to fetch data every second
    const intervalId = setInterval(fetchAcceptedUsers, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleRemove = async (userId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`http://localhost:8000/collaboration/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from localStorage
      let collabUsers = JSON.parse(localStorage.getItem('collaboratingUsers')) || [];
      collabUsers = collabUsers.filter((id) => id !== userId);
      localStorage.setItem('collaboratingUsers', JSON.stringify(collabUsers));

      // Update the state
      setAcceptedUsers(acceptedUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const toggleCollaboration = (userId, isCollaborating) => {
    let collabUsers = JSON.parse(localStorage.getItem('collaboratingUsers')) || [];

    if (isCollaborating) {
      if (!collabUsers.includes(userId)) {
        collabUsers.push(userId);
      }
    } else {
      collabUsers = collabUsers.filter((id) => id !== userId);
    }

    localStorage.setItem('collaboratingUsers', JSON.stringify(collabUsers));

    // Update the state to reflect the change
    setAcceptedUsers(acceptedUsers.map((user) =>
      user._id === userId ? { ...user, collaborate: isCollaborating } : user
    ));
  };

  return (
    <div className="section">
      <h2>Accepted Users</h2>
      {acceptedUsers.length === 0 ? (
        <p>No accepted users found</p>
      ) : (
        acceptedUsers.map((user) => (
          <Card key={user._id} className="mb-3">
            <Card.Body>
              <Card.Title>{user.requested_user.email || 'No Email Provided'}</Card.Title>
              <Card.Text>{user.requested_user.details || 'No Details Provided'}</Card.Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FaUserCheck color="blue" size={20} />
                <Form.Check
                  type="checkbox"
                  label="Collaborate"
                  checked={JSON.parse(localStorage.getItem('collaboratingUsers'))?.includes(user.requested_user._id) || false}
                  onChange={(e) => toggleCollaboration(user.requested_user._id, e.target.checked)}
                />
                <Button
                  variant="danger"
                  onClick={() => handleRemove(user._id)}
                >
                  Remove
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default AcceptedUsersList;
