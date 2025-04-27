import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FcUpload } from 'react-icons/fc';
import axios from 'axios';

const RequestedUsersList = () => {
  const [requestedUsers, setRequestedUsers] = useState([]);

  useEffect(() => {
    const fetchRequestedUsers = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await axios.get('http://localhost:8000/collaboration/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Assuming that the response data contains a list of requests
        const filteredRequests = response.data.filter((request) => 
          request.requesting_user._id === userId && !request.accepted
        );
        
        setRequestedUsers(filteredRequests);
      } catch (error) {
        console.error('Error fetching requested users:', error);
      }
    };

    // Fetch data initially
    fetchRequestedUsers();

    // Set up an interval to fetch data every second
    const intervalId = setInterval(fetchRequestedUsers, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleCancelRequest = async (id) => {
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`http://localhost:8000/collaboration/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the state to remove the canceled request
      setRequestedUsers(requestedUsers.filter((request) => request._id !== id));
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  return (
    <div className="section">
      <h2>Requested Users</h2>
      {requestedUsers.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requestedUsers.map((request) => (
          <Card key={request._id} className="mb-3">
            <Card.Body>
              <Card.Title>{request.requested_user.email || 'No Email Provided'}</Card.Title>
              <FcUpload color="green" size={20} style={{ float: 'right' }} />
              <Button
                variant="danger"
                onClick={() => handleCancelRequest(request._id)}
                style={{ marginTop: '10px' }}
              >
                Cancel
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default RequestedUsersList;
