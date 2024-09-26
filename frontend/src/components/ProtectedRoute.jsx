import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserSideBar from './User/UserSideBar';
import AdminSideBar from './Admin/AdminSideBar';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to indicate loading
  const [userId, setUserId] = useState(''); // Add state for user ID
  const [role, setRole] = useState(''); // Add state for user role
  const location = useLocation();

  // Paths that should trigger the admin sidebar
  const isCodeSpaceRoute = location.pathname.startsWith('/codespace');
  const isAdminSidebarRoute = location.pathname === '/questions'|| location.pathname.startsWith('/posted/')|| location.pathname === '/posted' ;

  useEffect(() => {
    // Call your backend to check if the user is authenticated and fetch their role
    fetch('http://localhost:5000/api/auth/status', {
      method: 'GET',
      credentials: 'include', // Include cookies with request
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserId(data.userId); // Set the user ID from the response
          setRole(data.role); // Set the role from the response
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false); // Treat as unauthenticated on error
      });
  }, []);

  if (isAuthenticated === null) {
    // While checking auth status, you might want to show a loading spinner or something similar
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // Determine which sidebar to render based on the role or the route
    const SidebarComponent = isAdminSidebarRoute ? AdminSideBar : (role === 'admin' ? AdminSideBar : UserSideBar);

    return isCodeSpaceRoute ? (
      // Full screen for CodeSpace route
      <Component {...rest} userId={userId} />
    ) : (
      <div className="app-container">
        <SidebarComponent onLogout={() => setIsAuthenticated(false)} /> {/* Render the appropriate sidebar */}
        <div className="content">
          <Component {...rest} userId={userId} />
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;



