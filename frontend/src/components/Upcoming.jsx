import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const UpcomingTests = () => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests');
        const tests = response.data;

        // Get the current time
        const currentTime = new Date().getTime();

        // Filter tests where fromTime is after the current time
        const upcomingTests = tests.filter((test) => {
          const fromTime = new Date(test.fromTime).getTime();
          return fromTime > currentTime;
        });

        setUpcomingTests(upcomingTests);
      } catch (err) {
        console.error('Error fetching tests:', err.response || err.message);
        setError('Error fetching upcoming tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="upcoming-tests-page">
      <h2>Upcoming Tests</h2>
      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p>{error}</p>
      ) : upcomingTests.length > 0 ? (
        <div className="tests-grid">
          {upcomingTests.map((test) => (
            <div key={test._id} className="test-box">
              <h3>{test.topic}</h3>
              <p>Test ID: {test.customId}</p>
              <p>Starts At: {new Date(test.fromTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming tests available.</p>
      )}
    </div>
  );
};

export default UpcomingTests;
