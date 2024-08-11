  import React from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import '../App.css';

  
  const AdminSideBar = ({ onLogout }) => {
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
          <li><Link to="/home">InfoBoard</Link></li>
          <li><Link to="/about">Analytics</Link></li>
          <li><Link to="/posted">Posted Questions</Link></li>
          <li><Link to="/questions"> Add Questions</Link></li>
          <li><Link to="/admins"> Admins</Link></li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  export default AdminSideBar;
