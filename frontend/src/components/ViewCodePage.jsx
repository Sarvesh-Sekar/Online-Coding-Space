import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserSideBar from './User/UserSideBar'; // Import UserSideBar
import AdminSideBar from './Admin/AdminSideBar'; // Import AdminSideBar
import '../App.css';

const ViewCode = () => {
  const { historyId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(''); // State for user role

  useEffect(() => {
    // Fetch user role
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/status', { withCredentials: true });
        setUserRole(response.data.role); // Assuming the response contains a role field
        console.log(response.data.role)
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    // Fetch the submission data from the backend
    fetch(`http://localhost:5000/view-submission/${historyId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setSubmissionData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching submission data:', error);
        setLoading(false);
      });
  }, [historyId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!submissionData || !submissionData.questionsSubmitted || submissionData.questionsSubmitted.length === 0) {
    return <p>No submissions found.</p>;
  }

  return (
    <div className="view-code-container">
      {userRole === 'admin' ? <AdminSideBar /> : <UserSideBar />} {/* Conditional Sidebar Rendering */}
      <h2>Submitted Codes for Topic: {submissionData.topicName}</h2>
      {submissionData.questionsSubmitted.map((submission, index) => (
        <div key={index} className="submission-container">
          <h3>Problem Name: {submission.problemName}</h3>
          <p>Language: {submission.language}</p>
          <pre className="code-box">{submission.code}</pre>
          <p>Filename: {submission.filename}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewCode;
