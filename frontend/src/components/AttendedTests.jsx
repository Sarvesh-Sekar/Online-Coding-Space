import React, { useEffect, useState } from 'react';
import UserSideBar from './User/UserSideBar';
import AdminSideBar from './Admin/AdminSideBar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css'; // Import the custom CSS

const AttendedTests = () => {
  const [attendedTests, setAttendedTests] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [role, setUserRole] = useState('');
  const [editStatusId, setEditStatusId] = useState(null); // Track which test is being edited
  const [newStatus, setNewStatus] = useState(''); // Track new status being selected

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
    // Fetch the user's history from the backend
    fetch(`http://localhost:5000/history-attended/${userId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (data.attended) {
          setAttendedTests(data.attended);
        } else {
          console.error('No history found:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching history:', error));
  }, [userId]);

  // Function to handle the "View Code" button click
  const viewCode = (problemId) => {
    navigate(`/view-code/${problemId}`); // Assuming the route exists for viewing the code
  };

  // Function to handle the "Update" button click for admin
  const handleUpdateClick = (testId, currentStatus) => {
    setEditStatusId(testId); // Set the test ID for which the status is being edited
    setNewStatus(currentStatus ? 'Completed' : 'Not Completed'); // Set the dropdown to the current status
  };

  // Function to handle saving the updated status
  const handleSaveStatus = async (testId) => {
    const updatedStatus = newStatus === 'Completed';

    try {
      // Make an API call to update the test status in the backend
      await axios.put(`http://localhost:5000/update-test-status/${testId}`, { status: updatedStatus }, { withCredentials: true });

      // Update the local state to reflect the change
      setAttendedTests((prevTests) =>
        prevTests.map((test) =>
          test._id === testId ? { ...test, testStatus: updatedStatus } : test
        )
      );

      // Reset the editing state
      setEditStatusId(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating test status:', error);
    }
  };

  return (
    <div className="attended-tests-container">
      {role === 'admin' ? <AdminSideBar /> : <UserSideBar />}
      <div className="attended-tests-content">
        <h2>Attended Tests</h2>

        {attendedTests.length > 0 ? (
          <table className="attended-tests-table">
            <thead>
              <tr>
                <th>Topic Name</th>
                <th>Completed Status</th>
                {role === 'admin' && <th>Update</th>}
                <th>View Code</th>
              </tr>
            </thead>
            <tbody>
              {attendedTests.map((test, index) => (
                <tr key={index}>
                  <td>{test.topicName}</td>
                  <td>
                    {/* Render the status normally if not being edited */}
                    {role === 'admin' && editStatusId === test._id ? (
                      <>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="status-dropdown"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Not Completed">Not Completed</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(test._id)}
                          className="save-status-btn"
                        >
                          ✔️
                        </button>
                      </>
                    ) : (
                      test.testStatus ? 'Completed' : 'Not Completed'
                    )}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <button
                        onClick={() => handleUpdateClick(test._id, test.testStatus)}
                        className="edit-status-btn"
                      >
                        ✏️ Update
                      </button>
                    </td>
                  )}
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
          <p>No attended tests found.</p>
        )}
      </div>
    </div>
  );
};

export default AttendedTests;
