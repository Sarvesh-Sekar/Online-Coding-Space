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


router.get('/api/tests', async (req, res) => {
    try {
      const tests = await Test.find();
     
      if (tests.length > 0) {
        res.json(tests);
      } else {
        res.status(404).json({ message: 'No tests found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tests', error });
    }
  });
  
  router.get('/view-submissions/:testId', async (req, res) => {
    const { testId } = req.params;
  
    try {
      // Find all history records for the given testId
      const submissions = await History.find({ topicId :testId });
  
      // If no submissions are found
      if (submissions.length === 0) {
        return res.status(404).json({ message: 'No submissions found for this test' });
      }
  
      // Array to store the submissions along with user details
      const submissionsWithUserDetails = [];
  
      // Loop through the submissions to fetch the user details
      for (const submission of submissions) {
        // Find the user by the userId in each submission
        const user = await User.findById(submission.userId);
  
        // If user is found, combine submission and user details
        if (user) {
          submissionsWithUserDetails.push({
            userId: user._id,
            name: user.displayName,
            email: user.email,
            rollNo: user.rollNo,
            submissionTime: submission.submissionTime,
            testStatus:submission.testStatus,
            _id: submission._id, // history record ID to view the code later
          });
        }
      }
  
      // Send the response with submissions and user details
      res.json(submissionsWithUserDetails);
  
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ message: 'Error fetching submissions', error });
    }
  });

  router.get('/history/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId)
  
      // Fetch the test history for the given user ID
      const userHistory = await History.find({ userId });
      
  
      // If no history is found, return an empty array
      if (!userHistory || userHistory.length === 0) {
        return res.status(200).json([]);
      }
  
      // Return the user's test history
      res.status(200).json(userHistory);
    } catch (err) {
      console.error('Error fetching user history:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/history-attended/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
  
    try {
      // Fetch all history entries from the History model
      const allHistory = await History.find();
      
      // Filter entries based on matching userId
      const userHistory = allHistory.filter((history) => history.userId === userId);
      console.log(userHistory)
  
      if (userHistory.length === 0) {
        return res.status(404).json({ message: 'No history found for this user' });
      }
  
      console.log('Filtered User History:', userHistory); // Check what data is coming from DB
  
      // Send back the filtered history data
      res.json({ attended: userHistory });
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ error: 'Error fetching history' });
    }
  });
  
  router.get('/history-completed/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
  
    try {
      // Fetch all history entries from the History model
      const allHistory = await History.find();
  
      // Filter entries based on matching userId and testStatus being true
      const completedTests = allHistory.filter(
        (history) => history.userId === userId && history.testStatus === true
      );
      
  
      if (completedTests.length === 0) {
        return res.status(404).json({ message: 'No completed tests found for this user' });
      }
  
      // Send back the filtered history data
      res.json({ completed: completedTests });
    } catch (error) {
      console.error('Error fetching completed tests:', error);
      return res.status(500).json({ error: 'Error fetching completed tests' });
    }
  });
  
  module.exports = router;