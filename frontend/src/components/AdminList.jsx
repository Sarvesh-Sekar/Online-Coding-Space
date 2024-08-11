import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const AdminListPage = () => {
  const { customId } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${customId}/questions`);
        setProblems(response.data);
      } catch (err) {
        setError('Error fetching problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [customId]);

  const handleDeleteClick = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tests/${customId}/questions/${questionId}`);
      setProblems(problems.filter((problem) => problem.questionId !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Error deleting question');
    }
  };

  const handleViewSubmissionsClick = (questionId) => {
    navigate(`/posted/submissions/${customId}/${questionId}`);
  };

  return (
    <div className="problems-page">
      <h2>Problems for Test {customId} (Admin)</h2>
      {loading ? (
        <p>Loading problems...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Problem ID</th>
              <th>Name of the Problem</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td>{problem.questionId}</td>
                <td>{problem.title}</td>
                <td>
                  <button onClick={() => handleViewSubmissionsClick(problem.questionId)}>View Submissions Page</button>
                  <button onClick={() => handleDeleteClick(problem.questionId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminListPage;
