import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const SubmissionsPage = () => {
  const { testId } = useParams(); // testId from the URL
  console.log(testId)
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/view-submissions/${testId}`);
      
        setSubmissions(response.data);
      } catch (err) {
        setError('Error fetching submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [testId]);

  const handleViewCodeClick = (historyId) => {
    navigate(`/view-code/${historyId}`); // Navigate to ViewCodePage with historyId
  };

  return (
    <div className="submissions-page">
      <h2>Submissions for Test {submissions.topic} (Admin)</h2>
      {loading ? (
        <p>Loading submissions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roll No</th>
              <th>Completed Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.rollNo}</td>
                <td>{(submission.testStatus)?"Completed":"Not Completed"}</td>
                <td>
                  <button onClick={() => handleViewCodeClick(submission._id)}>
                    View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionsPage;
