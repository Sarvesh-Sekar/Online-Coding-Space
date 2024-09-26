import React, { useState, useEffect } from 'react';

import UserSideBar from './UserSideBar';
import axios from 'axios';
import '../../App.css';

const UpdateDetails = ({userId}) => {

  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success message

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const batches = ['2020', '2021', '2022', '2023'];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/update-details/${userId}`, {
          withCredentials: true,
        });
        const data = response.data;
        setRollNo(data.rollNo || '');
        setDepartment(data.department || '');
        setBatch(data.batch || '');
        setLoading(false);
      } catch (err) {
        
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setSuccess(''); // Clear any previous success messages

    try {
      const response = await axios.post(
        `http://localhost:5000/api/update-user/${userId}`,
        { rollNo, department, batch },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess('User details updated successfully!'); // Set success message
      } else {
        setError('Failed to update user details.');
      }
    } catch (err) {
      setError('Error updating user details.');
    }
  };

  return (
    <div className="update-details-container">
      <UserSideBar />
      <div className="update-details-content">
        <h2>Update Details</h2>
        {loading ? (
          <p>Loading user details...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Roll No:</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Department:</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Batch:</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Update</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>} {/* Display success message */}
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateDetails;
