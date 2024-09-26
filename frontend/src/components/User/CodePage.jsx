import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import '../../App.css';

function CodeSpace() {
  const { customId, userId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('.js');
  const [questionName , setquestionName] = useState('')
  const [topicName , setTopicName] = useState('')
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [input, setInput] = useState('');
  const [code, setCode] = useState({
    '.js': '',
    '.py': '',
    '.java': '',
    '.cpp': '',
    '.c': '',
  });
  const [problemDetails, setProblemDetails] = useState({});
  const [testCaseStatus, setTestCaseStatus] = useState([]);
  const [canProceedToNext, setCanProceedToNext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      const storedQuestion = localStorage.getItem('currentQuestion');
      if (storedQuestion) {
        const questionData = JSON.parse(storedQuestion);
        setProblemDetails(questionData);
        setTestCaseStatus(Array(questionData.numberOfTestCases).fill('Not Passed'));
      } else {
        await fetchRandomQuestion();
      }
    };

    const fetchTimer = async () => {
      try {
        console.log(customId)
        const response = await axios.get(`http://localhost:5000/time/tests/${customId}`);
        const { toTime } = response.data;
        if (toTime) {
          setTimer(toTime);
        } else {
          console.error('Invalid toTime received:', toTime);
        }
      } catch (error) {
        console.error('Error fetching timer:', error);
      }
    };
    console.log(customId)

    fetchQuestionDetails();
    fetchTimer();

    return () => clearInterval(timerInterval);
  }, [customId]);

  let timerInterval = null;

  const setTimer = (endTime) => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);

      if (isNaN(end.getTime())) {
        console.error('Invalid endTime format:', endTime);
        setTimeLeft('00:00');
        return;
      }

      const difference = end - now;

      if (difference <= 0) {
        clearInterval(timerInterval);
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor(difference / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    timerInterval = setInterval(calculateTimeLeft, 1000);
  };

  const fetchRandomQuestion = async (excludedId = null) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tests/${customId}/questions/random`, {
        params: { excludedId },
      });
      const { questionId, title, description, sampleTestCase, numberOfTestCases, topicName } = response.data;
  
      const newProblemDetails = {
        questionId,
        title,
        description,
        sampleTestCase,
        numberOfTestCases
      };
  
      setProblemDetails(newProblemDetails);
      setquestionName(title); // Set question name
      setTopicName(topicName); // Set topic name
      setTestCaseStatus(Array(numberOfTestCases).fill('Not Passed'));
      localStorage.setItem('currentQuestion', JSON.stringify(newProblemDetails));
    } catch (error) {
      console.error('Error fetching random question:', error);
    }
  };
  

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
  const handleCodeChange = (value) => {
    setCode(prevCode => ({
      ...prevCode,
      [language]: value,
    }));
  
    // Store the updated code in localStorage
    localStorage.setItem(`code-${language}`, value);
  };
  
  // Add a useEffect hook to load code from localStorage when component mounts
  useEffect(() => {
    // Retrieve the saved code from localStorage for the current language
    const storedCode = localStorage.getItem(`code-${language}`);
    if (storedCode) {
      setCode(prevCode => ({
        ...prevCode,
        [language]: storedCode,
      }));
    }
  }, [language]); 

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/submit/${customId}/${problemDetails.questionId}`, {
        language,
        code: code[language],
        fileName
      });

      const { passedCount, results, firstTestCaseOutput } = response.data;
      const allPassed = results.every(result => result.status === 'Passed');
      setTestCaseStatus(results.map(result => result.status));
      setCanProceedToNext(allPassed);

      setOutput(firstTestCaseOutput);
    } catch (error) {
      console.error('Error submitting code:', error.response || error.message);
      setOutput('Error submitting code.');
    }
  };

  const handleFinish = async () => {
    const allTestCasesPassed = testCaseStatus.every(status => status === 'Passed');
  
    if (!allTestCasesPassed) {
      const confirmation = window.confirm('Not all test cases are passed. Would you like to end the test and submit this question?');
      if (confirmation) {
        try {
          await axios.post(`http://localhost:5000/finish/${userId}/${customId}/${problemDetails.questionId}`, {
            language,
            code: code[language],
            filename: fileName,
            completed: false, // Explicitly send that this question is not completed
            questionName: problemDetails.title,
            topicName: topicName // You can set the topic name somewhere else in your state management
          });
          navigate(`/attended`);
        } catch (error) {
          console.error('Error submitting incomplete question:', error.response || error.message);
          alert('Error submitting incomplete question.');
        }
      }
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/finish/${userId}/${customId}/${problemDetails.questionId}`, {
        language,
        code: code[language],
        filename: fileName,
        completed: true, // Send completion status as true
        questionName: problemDetails.title,
        topicName: topicName // Include the topic name
      });
  
      const { completed, nextQuestion } = response.data;
  
      if (completed) {
        navigate(`/attended`);
      } else if (nextQuestion) {
        setProblemDetails(nextQuestion);
        setTestCaseStatus(Array(nextQuestion.numberOfTestCases).fill('Not Passed'));
        localStorage.setItem('currentQuestion', JSON.stringify(nextQuestion));
      }
    } catch (error) {
      console.error('Error submitting completed question:', error.response || error.message);
      alert('Error submitting.');
    }
  };
  
  
  
  

  const languageMode = {
    '.js': javascript(),
    '.py': python(),
    '.java': java(),
    '.cpp': cpp(),
    '.c': cpp(),
  };

  return (
    <div className="container">
      <div className="timer">
        <h3>Time Left: {timeLeft || 'Loading...'}</h3>
      </div>
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
        <h3>Code Editor</h3>
        <div className="language-selection">
          <label>Select Language:</label>
          <select value={language} onChange={handleLanguageChange}>
            <option value=".js">JavaScript</option>
            <option value=".py">Python</option>
            <option value=".java">Java</option>
            <option value=".cpp">C++</option>
            <option value=".c">C</option>
          </select>
        </div>
        <div>
          <label>File Name:</label>
          <input type="text" value={fileName} onChange={handleFileNameChange} placeholder="Enter file name" />
        </div>
        <div>
          <CodeMirror
            value={code[language]}
            height="200px"
            extensions={[languageMode[language]]}
            theme={oneDark}
            onChange={handleCodeChange}
          />
        </div>
        <div>
          <label>Input:</label>
          <textarea value={input} onChange={handleInputChange} placeholder="Enter input" />
        </div>
        <div>
          <button onClick={runCode}>Run Code</button>
          <button onClick={handleSubmit}>Submit Code</button>
          <button onClick={handleFinish}>Finish</button>
        </div>
        <div className="output-section">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default CodeSpace;
