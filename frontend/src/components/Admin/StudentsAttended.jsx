import React, { useEffect, useState } from 'react';
import AdminSideBar from './AdminSideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const StudentsAttended = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch the students who attended the tests on component mount
  useEffect(() => {
    const fetchStudentsAttended = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students-attended-details', { withCredentials: true });
        setStudents(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching students attended:', error);
      }
    };

    fetchStudentsAttended();
  }, []);

  // Function to handle the 'View Code' button click
  const handleViewCode = (userId) => {
    // Navigate to a route like /code-view/:userId for viewing the code of the selected user
    navigate(`/view-code/${userId}`);
  };

  return (
    <div className="students-attended-container">
      <AdminSideBar />
      <div className="students-attended-content">
        <h2>Students Attended</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Completed Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.userId}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.completed}</td>
                <td>
                  <button onClick={() => handleViewCode(student.userId)}>View Code</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsAttended;
