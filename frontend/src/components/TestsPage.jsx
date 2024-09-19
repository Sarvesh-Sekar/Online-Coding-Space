import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const TestsPage = ({ userId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendedTests, setAttendedTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch the user's history
        const historyResponse = await axios.get(`http://localhost:5000/history/${userId}`);
        setAttendedTests(historyResponse.data);

        // If the user has attended tests, don't show any tests
        if (historyResponse.data.length > 0) {
          setTests([]); // No tests to show
        } else {
          // If no history, fetch available tests
          const testsResponse = await axios.get('http://localhost:5000/api/tests');
          const currentTime = new Date();

          // Filter tests based on the current time
          const filteredTests = testsResponse.data.filter(test => {
            const fromTime = new Date(test.fromTime);
            const toTime = new Date(test.toTime);

            return (!fromTime || !toTime || (currentTime >= fromTime && currentTime <= toTime));
          });

          setTests(filteredTests);
        }
      } catch (err) {
        console.error('Error fetching data:', err.response || err.message);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [userId]);

  const handleTestClick = (customId) => {
    navigate(`/instructions/${customId}/${userId}`);
  };

  return (
    <div className="tests-page">
      <h2>Available Tests</h2>
      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tests.length > 0 ? (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-box" onClick={() => handleTestClick(test.customId)}>
              <h3>{test.topic}</h3>
              <p>Test ID: {test.customId}</p>
              <p>From: {new Date(test.fromTime).toLocaleString()}</p>
              <p>To: {new Date(test.toTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tests available right now</p>
      )}
    </div>
  );
};

export default TestsPage;
