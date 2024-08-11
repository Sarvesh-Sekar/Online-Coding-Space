import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ViewCodePage = () => {
  const { userId, problemId } = useParams();
  const [code, setCode] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/code/${userId}/${problemId}`);
        const fullDateTime = new Date(response.data.submissionTime);
        setSubmissionDate(fullDateTime.toLocaleDateString());
        setSubmissionTime(fullDateTime.toLocaleTimeString());
        setCode(response.data.code);
      } catch (err) {
        setError('Error fetching code');
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [userId, problemId]);

  return (
    <div className="view-code-page">
      <h2>Code Submission</h2>
      {loading ? (
        <p>Loading code...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="datetime">
            <p><strong>Date:</strong> {submissionDate}</p>
            <p><strong>Time:</strong> {submissionTime}</p>
          </div>
          <pre className="code-block">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ViewCodePage;
