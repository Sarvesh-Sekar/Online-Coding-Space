// Layout.js
import React from 'react';
import UserSideBar from './UserSideBar';
import '../App.css';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="layout">
      <UserSideBar onLogout={onLogout} />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
