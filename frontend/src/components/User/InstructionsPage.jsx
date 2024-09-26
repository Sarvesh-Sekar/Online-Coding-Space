import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const InstructionsPage = () => {
  const { customId, userId } = useParams();
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [checkedInstructions, setCheckedInstructions] = useState(new Array(6).fill(false));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        console.log(customId)
        const response = await axios.get(`http://localhost:5000/api/tests/${customId}`);
        setTopic(response.data.topic);
        setNumQuestions(response.data.numQuestions);
      } catch (err) {
        console.error('Error fetching test details:', err.response || err.message);
        setError('Error fetching test details');
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [customId]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedInstructions = [...checkedInstructions];
    updatedCheckedInstructions[index] = !updatedCheckedInstructions[index];
    setCheckedInstructions(updatedCheckedInstructions);
  };

  const allChecked = checkedInstructions.every(Boolean);

  const handleStartTest = () => {
    if (allChecked) {
      navigate(`/codespace/${customId}/${userId}`);
    }
  };

  return (
    <div className="instructions-page">
      <h2>Instructions for {topic} Test</h2>
      {loading ? (
        <p>Loading instructions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Number of Questions: {numQuestions}</p>
          <div className="instructions-list">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="instruction-item">
                <input
                  type="checkbox"
                  id={`instruction-${index}`}
                  checked={checkedInstructions[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                <label htmlFor={`instruction-${index}`}>Instruction {index + 1}</label>
              </div>
            ))}
          </div>
          <button
            onClick={handleStartTest}
            disabled={!allChecked}
            className={`start-button ${allChecked ? '' : 'disabled'}`}
          >
            Start Test
          </button>
        </>
      )}
    </div>
  );
};

export default InstructionsPage;
