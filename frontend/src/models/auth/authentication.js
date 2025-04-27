import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

// Custom hook or component
const useAuthnticate = () => {
  const navigate = useNavigate();

  const isAuthnticate = () => {
    const token = localStorage.getItem('jwtToken');
    console.log(token);

    if (!token) {
      navigate('/login');
      return; // Exit early if no token
    }

    try {
      // Decode the token to extract the expiration time
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert current time to seconds

      // Check if the token is expired
      if (decodedToken.exp < currentTime) {
        // Token is expired
        console.log('Token has expired');
        navigate('/login');
      } else {
        // Token is valid
        console.log('Token is valid');
        // Additional logic for valid token can be added here
      }
    } catch (error) {
      console.log('Invalid token');
      navigate('/login'); // Handle invalid token by navigating to login
    }
  };

  return isAuthnticate;
};

export default useAuthnticate;
