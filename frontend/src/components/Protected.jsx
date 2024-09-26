import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashBoard';
import UserDashboard from './User/UserDashboard';

const Protected = () => {
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  console.log('hi')
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start as null
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/protected', { withCredentials: true })
      .then(response => {
        console.log('Response from /api/protected:', response.data);
        setMessage(response.data.message); // Set the message from the response
        setRole(response.data.role); // Set the role from the response
        console.log(role)
        setIsAuthenticated(true); // Set authenticated to true if successful
      })
      .catch(error => {
        console.error('Error fetching protected resource:', error);
        setIsAuthenticated(false); // Explicitly set to false on error
        navigate('/login'); // Redirect to login on error
      });
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading while authentication is being checked
  }

  return (
    <div>
      <h1 className='username'>{message}</h1> {/* Display the message */}
      {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Protected;
