import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const  AdminPostedQuestions = ({userId}) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests');
        setTests(response.data);
      } catch (err) {
        console.error("Error occurred:", err.response || err.message);
        if (err.response && err.response.status === 404) {
          setError('No tests found');
        } else {
          setError('Error fetching tests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tests/${testId}`);
        setTests(tests.filter(test => test._id !== testId)); // Update UI after deletion
      } catch (err) {
        console.error("Error occurred:", err.response || err.message);
        setError('Error deleting test');
      }
    }
  };
   const handleTestClick = (customId) => {
    console.log(customId)
    navigate(`/posted/${customId}/questions`);
  };

  return (
    <div className="admin-posted-questions">
      <h2>Posted Questions</h2>
      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="tests-grid">
          {tests.map(test => (
             <div key={test._id} className="test-box" onClick={() => handleTestClick(test._id)}>
              <h3>{test.topic}</h3>
              <p>Test ID: {test.customId}</p>
              <button onClick={() => handleDelete(test._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPostedQuestions;
