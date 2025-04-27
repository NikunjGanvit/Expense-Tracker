import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FcFeedback } from 'react-icons/fc';
import axios from 'axios';

const RequestingUsersList = () => {
  const [requestingUsers, setRequestingUsers] = useState([]);

  useEffect(() => {
    const fetchRequestingUsers = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await axios.get('http://localhost:8000/collaboration/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const filteredRequests = response.data.filter((request) => 
          request.requested_user._id === userId && !request.accepted
        );
        
        setRequestingUsers(filteredRequests);
      } catch (error) {
        console.error('Error fetching requesting users:', error);
      }
    };

    // Fetch data initially
    fetchRequestingUsers();

    // Set up an interval to fetch data every second
    const intervalId = setInterval(fetchRequestingUsers, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleAccept = async (requestId) => {
    const token = localStorage.getItem('jwtToken');
    
    try {
      await axios.put(`http://localhost:8000/collaboration/${requestId}`, {
        accepted: true,
        dateTime: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the local state to reflect the acceptance
      setRequestingUsers(requestingUsers.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeny = async (requestId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`http://localhost:8000/collaboration/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRequestingUsers(requestingUsers.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  return (
    <div className="section">
      <h2>Requesting Users</h2>
      {requestingUsers.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requestingUsers.map((request) => (
          <Card key={request._id} className="mb-3">
            <Card.Body>
              <Card.Title>{request.requesting_user.email || 'No Email Provided'}</Card.Title>
              <Card.Text>{request.requesting_user.details || 'No Details Provided'}</Card.Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FcFeedback size={20} />
                <div>
                  <Button
                    variant="success"
                    onClick={() => handleAccept(request._id)}
                    className="me-2"
                  >
                    Accept
                  </Button>
                  <Button variant="danger" onClick={() => handleDeny(request._id)}>
                    Deny
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default RequestingUsersList;
