import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ProblemsPage = () => {
  const { customId, userId } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${customId}/questions`);
        const problemsData = response.data;

        // Check completion status for each problem
        const updatedProblems = await Promise.all(
          problemsData.map(async (problem) => {
            try {
              const statusResponse = await axios.get(`http://localhost:5000/api/history/${userId}/${problem.questionId}`);
              return { ...problem, completed: statusResponse.data.completed };
            } catch (statusError) {
              console.error('Error fetching completion status:', statusError);
              return { ...problem, completed: false };
            }
          })
        );

        setProblems(updatedProblems);
      } catch (err) {
        setError('Error fetching problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [customId, userId]);

  return (
    <div className="problems-page">
      <h2>Problems for Test {customId}</h2>
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
              <th>Link</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td>{problem.questionId}</td>
                <td>{problem.title}</td>
                <td>
                  <Link to={`/codespace/${customId}/${problem.questionId}/${userId}`}>
                    View Problem
                  </Link>
                </td>
                <td>{problem.completed ? 'Completed' : 'Not Completed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProblemsPage;
