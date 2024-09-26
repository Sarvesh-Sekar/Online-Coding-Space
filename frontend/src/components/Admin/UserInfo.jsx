import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSideBar from './AdminSideBar'; // Import the sidebar

import '../../App.css'; // Make sure to create and import your CSS

const UserInfo = () => {
    const { userId } = useParams(); // Get the userId from URL params
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [attended, setAttended] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   

    

    useEffect(() => {
        // Fetch user details
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/users-info/${userId}`);
                setUser(userResponse.data);
            } catch (error) {
                setError('Error fetching user data');
            }
        };

        // Fetch user's test history
        const fetchTestHistory = async () => {
            try {
                const historyResponse = await axios.get(`http://localhost:5000/performance/${userId}`);
                setAttended(historyResponse.data.attended);
                setCompleted(historyResponse.data.completed);
            } catch (error) {
                setError('Error fetching test history');
            }
        };

        // Call both functions
        Promise.all([fetchUserData(), fetchTestHistory()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [userId]);

    // Handle navigation to attended and completed tests
    const handleViewAttended = () => {
        navigate(`/user-attended-tests/${userId}`); // Navigate to attended tests page
    };

    const handleViewCompleted = () => {
        navigate(`/user-completed-tests/${userId}`); // Navigate to completed tests page
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="view-code-container">
     <AdminSideBar></AdminSideBar>
            <div className="user-info-content">
                <h1>User Info</h1>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.displayName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Roll Number:</strong> {user.rollNo}</p>
                        <p><strong>Department:</strong> {user.department}</p>

                        <div className="test-stats-container">
                            <h3>Test Stats</h3>
                            <div className="test-box" onClick={handleViewAttended}>
                                <p><strong>Tests Attended:</strong> {attended}</p>
                            </div>
                            <div className="test-box" onClick={handleViewCompleted}>
                                <p><strong>Tests Completed:</strong> {completed}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No user data available</p>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
