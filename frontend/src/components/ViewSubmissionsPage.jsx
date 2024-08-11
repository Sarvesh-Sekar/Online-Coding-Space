import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ViewSubmissionsPage = () => {
  const { customId, questionId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/submissions/${customId}/${questionId}`);
        setSubmissions(response.data);
      } catch (err) {
        setError('No Submmission Found ');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [customId, questionId]);

  return (
    <div className="submissions-page">
      <h2>Submissions for Problem {questionId}</h2>
      {loading ? (
        <p>Loading submissions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Submission Link</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.email}</td>
                <td>
                  <Link to={`/posted/view-code/${submission.userId}/${questionId}`}>View Code</Link>
                </td>
                <td>{submission.completed ? 'Completed' : 'Not Completed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewSubmissionsPage;
