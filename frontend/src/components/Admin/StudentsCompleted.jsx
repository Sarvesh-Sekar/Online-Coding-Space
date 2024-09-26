import React, { useEffect, useState } from 'react';
import AdminSideBar from './AdminSideBar'; // Import the AdminSideBar
import axios from 'axios';
import '../../App.css'

const StudentsCompleted = () => {
  const [completedStudents, setCompletedStudents] = useState([]);

  useEffect(() => {
    // Fetch the list of students who have completed their tests
    const fetchCompletedStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students-completed-details');
        setCompletedStudents(response.data.completedStudents);
      } catch (error) {
        console.error('Error fetching completed students:', error);
      }
    };

    fetchCompletedStudents();
  }, []);

  return (
    <div className="students-completed-container">
      <AdminSideBar /> {/* Include Admin Sidebar */}
      <div className="completed-students-content">
        <h2>Students Who Completed Tests</h2>
        {completedStudents.length > 0 ? (
          <table className="completed-students-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Completed Status</th>
                <th>View Code</th>
              </tr>
            </thead>
            <tbody>
              {completedStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.completed}</td>
                  <td>
                    <button
                      onClick={() => window.location.href = `/view-code/${student.userId}`}
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
          <p>No students have completed their tests yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentsCompleted;
