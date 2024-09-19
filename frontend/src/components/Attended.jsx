import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const Attended = ({ userId }) => {
  const [attendedTests, setAttendedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendedTests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/history/${userId}`);
        setAttendedTests(response.data);
      } catch (err) {
        console.error('Error fetching attended tests:', err.response || err.message);
        setError('Error fetching attended tests');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendedTests();
  }, [userId]);

  return (
    <div className="attended-page">
      <h2>Attended Tests</h2>
      {loading ? (
        <p>Loading attended tests...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="tests-grid">
          {attendedTests.map((test) => (
            <div key={test._id} className="test-box">
              <h3>{test.topic}</h3>
              <p>Test ID: {test.topicId}</p>
              <p>Attended:Yes</p>
              <p>Status: {test.testStatus ? 'Completed' : 'Incomplete'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attended;
