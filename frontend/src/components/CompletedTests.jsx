import React, { useEffect, useState } from 'react';
import UserSideBar from './User/UserSideBar';
import AdminSideBar from './Admin/AdminSideBar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

const CompletedTests = () => {
  const [completedTests, setCompletedTests] = useState([]);
  const navigate = useNavigate();
  const[role,setUserRole] = useState('');
  const {userId} = useParams()

  useEffect(() => {
    // Fetch user role
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/status', { withCredentials: true });
        setUserRole(response.data.role); // Assuming the response contains a role field
  
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    // Fetch the user's completed tests from the backend
    fetch(`http://localhost:5000/history-completed/${userId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (data.completed) {
            
          setCompletedTests(data.completed);
        } else {
          console.error('No completed tests found:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching completed tests:', error));
  }, [userId]);

  // Function to handle the "View Code" button click
  const viewCode = (problemId) => {
    navigate(`/view-code/${problemId}`); // Assuming the route exists for viewing the code
  };

  return (
    <div className="completed-tests-container">
      {role === 'admin' ? <AdminSideBar /> : <UserSideBar />}
      <div className="completed-tests-content">
        <h2>Completed Tests</h2>

        {completedTests.length > 0 ? (
          <table className="completed-tests-table">
            <thead>
              <tr>
                <th>Topic Name</th>
                <th>Completed Status</th>
                <th>View Code</th>
              </tr>
            </thead>
            <tbody>
              {completedTests.map((test, index) => (
                <tr key={index}>
                  <td>{test.topicName}</td>
                  <td>{test.testStatus ? 'Completed' : 'Not Completed'}</td>
                  <td>
                    <button
                      onClick={() => viewCode(test._id)} // Pass problemId to navigate
                      className="view-code-btn"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No completed tests found.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedTests;
