import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const UserCard = ({ user, onSuccessRequestSent, clearUserList }) => {
  const sendCollaborationRequest = async () => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    try {
      await axios.post(
        'http://localhost:8000/collaboration/',
        {
          requesting_user: userId,
          requested_user: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("1");
      onSuccessRequestSent(); // Call the function passed from Collaboration to update requested users list
      clearUserList(); // Clear the user list
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Text>{user.email}</Card.Text>
        <Button onClick={sendCollaborationRequest}>
          Send Request <FaPaperPlane style={{ marginLeft: '5px' }} />
        </Button>
      </Card.Body>
    </Card>
  );
};

const SerchList = ({ userList, onSuccessRequestSent, clearUserList }) => {
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {userList.length === 0 ? (
        <p>No matches found</p>
      ) : (
        userList.map((user) => (
          <li key={user._id}>
            <UserCard
              user={user}
              onSuccessRequestSent={onSuccessRequestSent}
              clearUserList={clearUserList}
            />
          </li>
        ))
      )}
    </ul>
  );
};

export default SerchList;
