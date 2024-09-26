import React, { useEffect, useState } from 'react';
import UserSideBar from '../User/UserSideBar';
import { useNavigate } from 'react-router-dom';
import '../../App.css';


const Dashboard = ({ userId }) => {
  const [userInfo, setUserInfo] = useState({ username: '', rollNo: '' });
  const [upcomingTests, setUpcomingTests] = useState([]); 
  const [attendedTests, setAttendedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/user-details/${userId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUserInfo({ username: data.username, rollNo: data.rollNo });
      })
      .catch((error) => console.error('Error fetching user details:', error));

    fetch(`http://localhost:5000/tests-details/${userId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUpcomingTests(data.upcoming || []);
        setAttendedTests(data.attended || []);
        setCompletedTests(data.completed || []);
      })
      .catch((error) => console.error('Error fetching tests:', error));
  }, [userId]);

  // Navigate to individual test sections
  const handleSectionClick = (section) => {
    navigate(`/${section}-tests/${userId}`);
  };

  return (
    <div className="dashboard-container">
      <UserSideBar onLogout={() => navigate('/login')} />
      
      <div className="dashboard-content">
        <h1>Welcome, {userInfo.username}</h1>
        <p>Roll Number: {userInfo.rollNo}</p>

        {/* Upcoming Tests Container */}
        <div className="dashboard-section-container" onClick={() => handleSectionClick('upcoming')}>
          <h2>Upcoming Tests</h2>
          <div className="test-count">
            {upcomingTests.length > 0 ? `${upcomingTests.length} Upcoming Tests` : 'No upcoming tests'}
          </div>
        </div>

        {/* Attended Tests Container */}
        <div className="dashboard-section-container" onClick={() => handleSectionClick('attended')}>
          <h2>Attended Tests</h2>
          <div className="test-count">
            {attendedTests.length > 0 ? `${attendedTests.length} Attended Tests` : 'No attended tests'}
          </div>
        </div>

        {/* Completed Tests Container */}
        <div className="dashboard-section-container" onClick={() => handleSectionClick('completed')}>
          <h2>Completed Tests</h2>
          <div className="test-count">
            {completedTests.length > 0 ? `${completedTests.length} Completed Tests` : 'No completed tests'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
