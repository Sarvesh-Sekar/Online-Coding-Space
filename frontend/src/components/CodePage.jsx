import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function CodeSpace() {
  const { customId, problemId, userId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('.js');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [input, setInput] = useState('');
  const [code, setCode] = useState({
    '.js': '',
    '.py': '',
    '.java': '',
    '.cpp': '',
    '.c': ''
  });
  const [problemDetails, setProblemDetails] = useState({
    title: '',
    description: '',
    sampleTestCase: '',
    numberOfTestCases: 0,
    testCases: []
  });
  const [testCaseStatus, setTestCaseStatus] = useState([]);
  const [firstTestCaseOutput, setFirstTestCaseOutput] = useState('');

  useEffect(() => {
    document.getElementById('editor').value = code[language];
  }, [language, code]);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${customId}/questions/${problemId}`);
        setProblemDetails(response.data);
        setTestCaseStatus(Array(response.data.numberOfTestCases).fill('Not Passed'));
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblemDetails();
  }, [customId, problemId]);

  const runCode = async () => {
    const currentCode = code[language];
    try {
      const response = await axios.post('http://localhost:5000/run', {
        language,
        code: currentCode,
        fileName,
        input
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error running code:', error.response || error.message);
      setOutput('Error running code.');
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(prevCode => ({
      ...prevCode,
      [language]: newCode
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/submit/${customId}/${problemId}`, {
        language,
        code: code[language],
        fileName
      });

      const results = response.data.results;
      setTestCaseStatus(results.map(result => result.status));
      setFirstTestCaseOutput(response.data.firstTestCaseOutput);
      setOutput(firstTestCaseOutput);
    } catch (error) {
      console.error('Error submitting code:', error.response || error.message);
      setOutput('Error submitting code.');
    }
  };

  const handleFinish = async () => {
    const confirmation = window.confirm('Would you like to finish?');
    if (confirmation) {
      try {
        const response = await axios.post(`http://localhost:5000/finish/${userId}/${customId}/${problemId}`, {
          language,
          code: code[language],
          filename: fileName // Ensure this matches the backend route
        });

        alert('Submission successful!');
        // Redirect to the ProblemsPage after successful submission
        navigate(`/tests/${customId}/questions/${userId}`); // Adjust the route if necessary
      } catch (error) {
        console.error('Error submitting:', error.response || error.message);
        alert('Error submitting.');
      }
    }
  };

  return (
    <div className="container">
      <div className="left-half">
        <h2>{problemDetails.title}</h2>
        <p>{problemDetails.description}</p>
        <h3>Sample Test Cases</h3>
        <p>{problemDetails.sampleTestCase}</p>
        <h3>Test Cases</h3>
        <p>Number of Test Cases: {problemDetails.numberOfTestCases}</p>
        <table>
          <thead>
            <tr>
              <th>Test Case</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {testCaseStatus.map((status, index) => (
              <tr key={index}>
                <td>Test Case {index + 1}</td>
                <td className={status === 'Passed' ? 'passed' : 'not-passed'}>
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="right-half">
        <div className="top-bar">
          <input
            type="text"
            className="file-name-input"
            placeholder="File Name"
            value={fileName}
            onChange={handleFileNameChange}
          />
          <select
            className="language-dropdown"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value=".js">JavaScript</option>
            <option value=".py">Python</option>
            <option value=".java">Java</option>
            <option value=".cpp">C++</option>
            <option value=".c">C</option>
          </select>
          <button className="run-button" onClick={runCode}>
            Run Code
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <textarea
          id="editor"
          className="text-editor"
          placeholder="Type your code here..."
          onChange={handleCodeChange}
        ></textarea>
        <div className="input-output-container">
          <textarea
            className="input-area"
            placeholder="Type your input here..."
            value={input}
            onChange={handleInputChange}
          ></textarea>
          <div className="output-area">
            <pre>{output}</pre>
          </div>
        </div>
        <button className="finish-button" onClick={handleFinish}>
          Finish
        </button>
      </div>
    </div>
  );
}

export default CodeSpace;
