const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const fs = require('fs/promises');
const User = require('../model/User')
const { ObjectId } = mongoose.Types;
const path = require('path')
//const { c , cpp , python ,java ,node} = require('compile-run')
const Test = require('../model/model')
const runCode = require('../controller/RunCode')
const generateCustomId = require('../Controller/CustomId')
const  runFile = require('compile-run')
const runSource = require('compile-run')
//const createfile = require('../Controller/file')
const History = require('../model/History');


router.get('/api/tests/:customId/questions/random', async (req, res) => {
    const { customId } = req.params;  // This is the test's _id (ObjectId in MongoDB)
    const excludedId = req.query.excludedId;  // Excluded question's _id (ObjectId)
  
    try {
      // Convert customId to ObjectId
      const testId = ObjectId.isValid(customId) ? new ObjectId(customId) : null;
      if (!testId) {
        return res.status(400).json({ message: 'Invalid test ID' });
      }
  
      // Find the test by _id and populate its questions
      const test = await Test.findById(testId).populate('questions');
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      if (!test.questions || test.questions.length === 0) {
        return res.status(404).json({ message: 'No questions found in this test' });
      }
  
      // Filter out the excluded question based on its _id
      const availableQuestions = test.questions.filter(question =>
        question._id.toString() !== excludedId
      );
  
      if (availableQuestions.length === 0) {
        return res.status(404).json({ message: 'No more unique questions available' });
      }
  
      // Select a random question from the available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
  
      // Send the selected random question's details as the response
      res.status(200).json({
        questionId: question._id,
        title: question.title,
        description: question.description,
        sampleTestCase: question.sampleTestCase,
        numberOfTestCases: question.testCases.length
      });
    } catch (error) {
      console.error('Error fetching random question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/run', async (req, res) => {
    const { language, code, fileName, input } = req.body;
  
    try {
      const result = await runCode(language, code, fileName, input);
      res.json({ output: result });
    } catch (error) {
      console.error('Error running code:', error);
      res.status(500).json({ output: 'Error running code.' });
    }
  });

  router.get('/api/tests/:customId/questions/random', async (req, res) => {
    const { customId } = req.params;  // This is the test's _id (ObjectId in MongoDB)
    const excludedId = req.query.excludedId;  // Excluded question's _id (ObjectId)
  
    try {
      // Convert customId to ObjectId
      const testId = ObjectId.isValid(customId) ? new ObjectId(customId) : null;
      if (!testId) {
        return res.status(400).json({ message: 'Invalid test ID' });
      }
  
      // Find the test by _id and populate its questions
      const test = await Test.findById(testId).populate('questions');
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      if (!test.questions || test.questions.length === 0) {
        return res.status(404).json({ message: 'No questions found in this test' });
      }
  
      // Filter out the excluded question based on its _id
      const availableQuestions = test.questions.filter(question =>
        question._id.toString() !== excludedId
      );
  
      if (availableQuestions.length === 0) {
        return res.status(404).json({ message: 'No more unique questions available' });
      }
  
      // Select a random question from the available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
  
      // Send the selected random question's details as the response
      res.status(200).json({
        questionId: question._id,
        title: question.title,
        description: question.description,
        sampleTestCase: question.sampleTestCase,
        numberOfTestCases: question.testCases.length
      });
    } catch (error) {
      console.error('Error fetching random question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/submit/:customId/:problemId', async (req, res) => {
    const { customId, problemId } = req.params;
    const { language, code, fileName } = req.body;
  
    // Validate ObjectId format
    console.log(problemId)
  
    try {
      const testDoc = await Test.findById(customId);
      if (!testDoc) {
        return res.status(404).send('Test not found');
      }
  
      // Convert the problemId in the params to an ObjectId
     //const problemObjectId = new ObjectId(problemId);
  
      // Compare with the ObjectId of the questions
      const problem = testDoc.questions.find(q => q._id.equals(problemId) || q.questionId===problemId);
      
      if (!problem) {
        return res.status(404).send('Problem not found');
      }
  
      const { testCases } = problem;
      let results = [];
      let firstTestCaseOutput = ''; // Variable to store the first test case output
  
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const combinedInput = testCase.inputs.join(' ');
        const combinedOutput = testCase.outputs.join(' ').replace(/\r?\n|\r/g, "");
  
        try {
          const result = await runCode(language, code, fileName, combinedInput);
          const cleanedResult = result.replace(/\r?\n|\r/g, "");
  
          if (i === 0) {
            firstTestCaseOutput = cleanedResult; // Capture the first test case output
          }
  
          if (cleanedResult === combinedOutput) {
            results.push({ testCase: i + 1, status: 'Passed' });
           
          } else {
            results.push({ testCase: i + 1, status: 'Failed' });
          }
        } catch (error) {
          console.error('Error during code execution:', error);
          results.push({ testCase: i + 1, status: 'Failed due to execution error' });
        }
      }
     
      const passedCount = results.filter(result => result.status === 'Passed').length;
      const overallResult = results.map(result => `Test Case ${result.testCase} ${result.status}`).join('\n');
      console.log(passedCount)
      res.json({ passedCount, results, overallResult, firstTestCaseOutput });
    } catch (error) {
      console.error('Error processing submission:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  router.post('/finish/:userId/:customId/:problemId', async (req, res) => {
    const { userId, customId, problemId } = req.params;
    const { language, code, filename, completed } = req.body;
  
    try {
      const testDoc = await Test.findById(customId);
      if (!testDoc) {
        return res.status(404).send('Test not found');
      }
  
      const problem = testDoc.questions.find(q => q._id.equals(problemId) || q.questionId === problemId);
      if (!problem) {
        return res.status(404).send('Problem not found');
      }
  
      const submissionTime = new Date().toISOString();
  
      // Find or create history entry
      let historyEntry = await History.findOne({ userId, topicId: customId });
  
      if (!historyEntry) {
        historyEntry = new History({
          userId,
          topicId: customId,
          topicName : testDoc.topic,
          questionToAnswer: testDoc.questionsToAttend,
          questionCompleted: 0,
          questionsSubmitted: []
        });
      }
  
      // Add the current question submission
      historyEntry.questionsSubmitted.push({
        problemId,
        problemName : problem.title,
        code,
        filename,
        language,
        submittedTime: submissionTime,
        completed
      });
  
      // If the question is fully completed, increment the questionCompleted count
      if (completed) {
        historyEntry.questionCompleted += 1;
      }
  
      // Check if all required questions are completed
      if (historyEntry.questionCompleted >= historyEntry.questionToAnswer) {
        historyEntry.testStatus = true;
        historyEntry.testCompletedTime = new Date().toISOString();
        await historyEntry.save();
  
        // All questions completed, return completed status as true
        return res.json({ completed: true });
      }
  
      await historyEntry.save();
  
      // If not all questions completed, return the next question
      if (completed) {
        const availableQuestions = testDoc.questions
          .filter(q => !q._id.equals(problemId)) // Exclude the current question
          .map(q => q);
  
        if (availableQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableQuestions.length);
          const nextQuestion = availableQuestions[randomIndex];
  
          return res.json({
            completed: false,
            nextQuestion: {
              questionId: nextQuestion._id,
              title: nextQuestion.title,
              description: nextQuestion.description,
              sampleTestCase: nextQuestion.sampleTestCase,
              numberOfTestCases: nextQuestion.testCases.length
            }
          });
        }
      }
  
      // If no more questions available, return completed
      res.status(201).json({ message: 'Submission recorded', completed: false });
    } catch (error) {
      console.error('Error processing finish:', error);
      res.status(500).send('Internal server error');
    }
  });

  router.get('/time/tests/:id', async (req, res) => {
    const { id } = req.params;  // Getting the _id from params
  
    try {
      // Attempt to find the test by its _id
      const test = await Test.findById(id);
  
      if (test) {
        // If the test is found, send it as a JSON response
        res.json(test);
      } else {
        // If the test is not found, respond with a 404 error
        res.status(404).json({ error: 'Test not found' });
      }
    } catch (error) {
      // Catch any errors that occur during the database operation and respond with a 500 error
      console.error('Error fetching test:', error);
      res.status(500).json({ error: 'An error occurred while fetching the test data' });
    }
  });

  
  module.exports = router;