import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const TestForm = () => {
  const [formData, setFormData] = useState({
    topic: '',
    numberOfQuestions: 0,
    questionsToAttend: 0, // New field
    fromTime: '', // New field
    toTime: '', // New field
    questions: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuestionsChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...formData.questions];
    questions[index] = {
      ...questions[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      questions,
    });
  };

  const handleNumberOfQuestionsChange = (e) => {
    const numberOfQuestions = parseInt(e.target.value, 10);
    if (!isNaN(numberOfQuestions) && numberOfQuestions >= 0) {
      const questions = new Array(numberOfQuestions).fill(null).map(() => ({
        description: '',
        title: '',
        sampleTestCase: '',
        numberOfTestCases: 0,
        testCases: [],
      }));
      setFormData({
        ...formData,
        numberOfQuestions,
        questions,
      });
    }
  };

  const handleNumberOfTestCasesChange = (questionIndex, e) => {
    const numberOfTestCases = parseInt(e.target.value, 10);
    if (!isNaN(numberOfTestCases) && numberOfTestCases >= 0) {
      const questions = [...formData.questions];
      questions[questionIndex] = {
        ...questions[questionIndex],
        numberOfTestCases,
        testCases: new Array(numberOfTestCases).fill(null).map(() => ({
          numberOfInputs: 0,
          numberOfOutputs: 0,
          inputs: [],
          outputs: [],
        })),
      };
      setFormData({
        ...formData,
        questions,
      });
    }
  };

  const handleNumberOfInputsChange = (questionIndex, testCaseIndex, e) => {
    const numberOfInputs = parseInt(e.target.value, 10);
    if (!isNaN(numberOfInputs) && numberOfInputs >= 0) {
      const questions = [...formData.questions];
      questions[questionIndex].testCases[testCaseIndex] = {
        ...questions[questionIndex].testCases[testCaseIndex],
        numberOfInputs,
        inputs: new Array(numberOfInputs).fill(''),
      };
      setFormData({
        ...formData,
        questions,
      });
    }
  };

  const handleNumberOfOutputsChange = (questionIndex, testCaseIndex, e) => {
    const numberOfOutputs = parseInt(e.target.value, 10);
    if (!isNaN(numberOfOutputs) && numberOfOutputs >= 0) {
      const questions = [...formData.questions];
      questions[questionIndex].testCases[testCaseIndex] = {
        ...questions[questionIndex].testCases[testCaseIndex],
        numberOfOutputs,
        outputs: new Array(numberOfOutputs).fill(''),
      };
      setFormData({
        ...formData,
        questions,
      });
    }
  };

  const handleInputsChange = (questionIndex, testCaseIndex, inputIndex, e) => {
    const { value } = e.target;
    const questions = [...formData.questions];
    questions[questionIndex].testCases[testCaseIndex].inputs[inputIndex] = value;
    setFormData({
      ...formData,
      questions,
    });
  };

  const handleOutputsChange = (questionIndex, testCaseIndex, outputIndex, e) => {
    const { value } = e.target;
    const questions = [...formData.questions];
    questions[questionIndex].testCases[testCaseIndex].outputs[outputIndex] = value;
    setFormData({
      ...formData,
      questions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/tests', {
        topic: formData.topic,
        questions: formData.questions,
        questionsToAttend: formData.questionsToAttend, // Posting the new field
        fromTime: formData.fromTime, // Posting the new field
        toTime: formData.toTime, // Posting the new field
      });
      console.log('Form Data Submitted:', response.data);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          topic: '',
          numberOfQuestions: 0,
          questionsToAttend: 0,
          fromTime: '',
          toTime: '',
          questions: [],
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {isSubmitted ? (
        <div className="success-message">
          Form submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Topic of the Test:</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Number of Questions:</label>
            <input
              type="number"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
            />
          </div>
          <div>
            <label>Number of Questions to Attend:</label>
            <input
              type="number"
              name="questionsToAttend"
              value={formData.questionsToAttend}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>From Time:</label>
            <input
              type="datetime-local"
              name="fromTime"
              value={formData.fromTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>To Time:</label>
            <input
              type="datetime-local"
              name="toTime"
              value={formData.toTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Number of Questions:</label>
            <input
              type="number"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
            />
          </div>
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question">
              <h4>Question {questionIndex + 1}</h4>
              <div>
                <label>Title:</label>
                <textarea
                  name="title"
                  value={question.title}
                  onChange={(e) => handleQuestionsChange(questionIndex, e)}
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={question.description}
                  onChange={(e) => handleQuestionsChange(questionIndex, e)}
                />
              </div>
              <div>
                <label>Sample Test Cases:</label>
                <textarea
                  name="sampleTestCase"
                  value={question.sampleTestCases}
                  onChange={(e) => handleQuestionsChange(questionIndex, e)}
                />
              </div>
              <div>
                <label>Number of Test Cases:</label>
                <input
                  type="number"
                  name="numberOfTestCases"
                  value={question.numberOfTestCases}
                  onChange={(e) => handleNumberOfTestCasesChange(questionIndex, e)}
                />
              </div>
              {question.testCases.map((testCase, testCaseIndex) => (
                <div key={testCaseIndex} className="test-case">
                  <h5>Test Case {testCaseIndex + 1}</h5>
                  <div>
                    <label>Number of Inputs:</label>
                    <input
                      type="number"
                      name="numberOfInputs"
                      value={testCase.numberOfInputs}
                      onChange={(e) => handleNumberOfInputsChange(questionIndex, testCaseIndex, e)}
                    />
                  </div>
                  {testCase.inputs.map((input, inputIndex) => (
                    <div key={inputIndex}>
                      <label>Input {inputIndex + 1}:</label>
                      <input
                        type="text"
                        name={`input${inputIndex}`}
                        value={input}
                        onChange={(e) => handleInputsChange(questionIndex, testCaseIndex, inputIndex, e)}
                      />
                    </div>
                  ))}
                  <div>
                    <label>Number of Outputs:</label>
                    <input
                      type="number"
                      name="numberOfOutputs"
                      value={testCase.numberOfOutputs}
                      onChange={(e) => handleNumberOfOutputsChange(questionIndex, testCaseIndex, e)}
                    />
                  </div>
                  {testCase.outputs.map((output, outputIndex) => (
                    <div key={outputIndex}>
                      <label>Output {outputIndex + 1}:</label>
                      <input
                        type="text"
                        name={`output${outputIndex}`}
                        value={output}
                        onChange={(e) => handleOutputsChange(questionIndex, testCaseIndex, outputIndex, e)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default TestForm;
