import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';

const UserSideBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (response.ok) {
          if (typeof onLogout === 'function') {
            onLogout();
          }
          navigate('/login'); // Redirect to the homepage after successful logout
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };
  

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        
        <li><Link to="/upcoming">Upcoming Tests</Link></li>
        
        <li><Link to="/tests">OnGoing</Link></li> 
        <li><Link to="/attended">Attended</Link></li>
        <li><Link to="/update-details">Update Details</Link></li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserSideBar;
