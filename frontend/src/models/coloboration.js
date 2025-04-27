import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import RequestedUsersList from './RequestedUsersList';
import RequestingUsersList from './RequestingUsersList';
import AcceptedUsersList from './AcceptedUsersList';
import useAuthnticate from './auth/authentication';

const Collaboration = () => {
  const [updateKey, setUpdateKey] = useState(0); // State to trigger re-render
  const isAuthnticate=useAuthnticate();
  useEffect(() => {
    isAuthnticate();
  }, [isAuthnticate]);

  const handleSuccessRequestSent = () => {
    // Increment the key to force re-render
    setUpdateKey((prevKey) => prevKey + 1);
  };

  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      <h1 className="text-center mt-4 mb-4">Collaboration</h1>

      <SearchComponent onSuccessRequestSent={handleSuccessRequestSent} />

      <div className="d-flex justify-content-around">
        {/* Requested Users Section */}
        <RequestedUsersList key={`requested-${updateKey}`} />

        {/* Requesting Users Section */}
        <RequestingUsersList key={`requesting-${updateKey}`} />

        {/* Accepted Users Section */}
        <AcceptedUsersList key={`accepted-${updateKey}`} />
      </div>

      {/* CSS for styling */}
      <style jsx>{`
        .section {
          width: 30%;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Collaboration;
