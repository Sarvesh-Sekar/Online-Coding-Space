import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const Ongoing = ({ userId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendedTests, setAttendedTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
  
        // Fetch unmatched tests directly from the updated route
        const testsResponse = await axios.get(`http://localhost:5000/api/tests/${userId}`);
  
        setTests(testsResponse.data); // Set the filtered tests
      } catch (err) {
        console.error('Error fetching data:', err.response || err.message);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTests();
  }, [userId]);
  
  

  // Update handleTestClick to navigate using test._id
  const handleTestClick = (testId) => {
    console.log(testId);  // Log the test._id
    navigate(`/instructions/${testId}/${userId}`);
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
            <div key={test._id} className="test-box" onClick={() => handleTestClick(test._id)}>
              <h3>{test.topic}</h3>
              <p>Test ID: {test.customId}</p> {/* Optionally, you can keep customId if needed */}
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

export default Ongoing;
