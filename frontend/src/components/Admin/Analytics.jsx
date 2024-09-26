import React, { useEffect, useState } from 'react';
import AdminSideBar from './AdminSideBar';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalTests: 0,
    totalAttended: 0,
    totalCompleted: 0,
  });
  const navigate = useNavigate();

  // Fetch the analytics data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics', { withCredentials: true });
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleCodeEditorClick = () => {
    window.open('/codespace')
  };

  return (
    <div className="analytics-container">
      <AdminSideBar />
      <div className="analytics-content">
        <h2>Analytics Dashboard</h2>
        <div className="analytics-boxes">
          <div className="analytics-box" onClick={() => navigate('/posted')}>
            <h3>Total Tests Conducted</h3>
            <p>{analyticsData.totalTests}</p>
          </div>
          <div className="analytics-box" onClick={() => navigate('/students-attended-details')}>
            <h3>Students Attended</h3>
            <p>{analyticsData.totalAttended}</p>
          </div>
          <div className="analytics-box" onClick={() => navigate('/students-completed-details')}>
            <h3>Students Completed</h3>
            <p>{analyticsData.totalCompleted}</p>
          </div>
        </div>

        <button className="code-editor-btn" onClick={handleCodeEditorClick}>
          Go to Code Editor
        </button>
      </div>
    </div>
  );
};

export default Analytics;
