import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import SerchList from './SerchList';
import { FaSearch, FaSearchMinus } from 'react-icons/fa';

const SearchComponent = ({ onSuccessRequestSent }) => {
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;
    const users = await axios.get('http://localhost:8000/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return users.data.filter((user) => user._id !== userId);
  };

  const deleteAlreadyRequestedUsers = async (users) => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;
    const response = await axios.get('http://localhost:8000/collaboration/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const colabs = response.data.filter(
      (colob) => colob.requesting_user._id === userId
    );

    return users.filter((user) => {
      let valid = true;
      const valids = colabs.map(
        (colab) => colab.requested_user._id === user._id
      );
      for (let i in valids) {
        if (valids[i]) valid = false;
      }
      return valid;
    });
  };

  const onChangeSearchText = async (e) => {
    setSearchText(e.target.value);
    const userData = await fetchUsers();

    if (e.target.value !== '') {
      const filteredUsers = await deleteAlreadyRequestedUsers(userData);
      setUserList(filteredUsers.filter((user) => user.email.includes(e.target.value)));
    } else {
      setUserList([]);
    }
  };

  const clearUserList = () => {
    console.log(2);
    setUserList([]);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Form className="mb-4">
        <Form.Group controlId="searchUser">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search by Email"
                value={searchText}
                onChange={onChangeSearchText}
              />
            </Col>
            <Col style={{ width: 'auto', minWidth: '200px' }}>
              {isSearchListVisible ? (
                <Button onClick={() => setIsSearchListVisible(false)}>
                  <FaSearchMinus style={{ marginRight: '5px' }} />
                </Button>
              ) : (
                <Button onClick={() => setIsSearchListVisible(true)}>
                  <FaSearch style={{ marginRight: '5px' }} />
                </Button>
              )}
            </Col>
          </Row>
        </Form.Group>
        <div style={{ display: isSearchListVisible ? 'block' : 'none' }}>
          <SerchList
            userList={userList}
            onSuccessRequestSent={onSuccessRequestSent}
            clearUserList={clearUserList} // Pass the clearUserList function
          />
        </div>
      </Form>
    </div>
  );
};

export default SearchComponent;
