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


router.get('/api/tests/:id', async (req, res) => {
    try {
      const { id } = req.params; // Using _id from the URL params
      const test = await Test.findById(id); // Find the test by _id
  
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
  
      res.json({ topic: test.topic, numQuestions: test.questionsToAttend });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/view-submission/:historyId', async (req, res) => {
    const { historyId } = req.params;
    console.log(historyId)
  
    try {
      const historyData = await History.findById(historyId);
      console.log(historyData)
      if (historyData) {
        res.status(200).json(historyData);
      } else {
        res.status(404).json({ message: 'Submission history not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching submission history.' });
    }
  });

  router.post('/api/update-user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { rollNo, department, batch } = req.body;
  
    try {
      // Find the user by ID and update their details
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { rollNo, department, batch },
        { new: true } // Return the updated user object
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser); // Send back the updated user data
    } catch (err) {
      console.error('Error updating user details:', err);
      res.status(500).json({ message: 'Failed to update user details' });
    }
  });

  module.exports = router;