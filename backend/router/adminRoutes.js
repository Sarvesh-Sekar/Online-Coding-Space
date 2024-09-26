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


router.post('/tests', async (req, res) => {
    const { topic, questions, questionsToAttend, fromTime, toTime } = req.body;
  
    try {
        const topicPrefix = topic.substring(0, 2).toUpperCase();
        const topicId = generateCustomId(topicPrefix, 1);
  
        const updatedQuestions = questions.map((question, index) => {
            const questionId = generateCustomId(topicPrefix, index + 1, true);
            return { ...question, questionId };
        });
  
        const newTest = new Test({
            customId: topicId,
            topic,
            questionsToAttend, // Save the new field
            fromTime, // Save the new field
            toTime, // Save the new field
            questions: updatedQuestions,
        });
  
        await newTest.save();
        res.status(201).send({ success: true });
    } catch (error) {
        console.error('Error saving test:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // common (TestsPage.jsx and AdminPosted.jsx) and Upcoming.jsx
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
    
    // Fetch submissions by testId and get user details manually
    // Fetch submissions by testId and get user details manually
  
    // common for both Admin and User - (Submissions.jsx and ViewCodePage.jsx)
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

    router.delete('/api/tests/:id', async (req, res) => {
        try {
          const { id } = req.params;
          const deletedTest = await Test.findByIdAndDelete(id);
          
          if (deletedTest) {
            res.json({ message: 'Test deleted successfully' });
          } else {
            res.status(404).json({ message: 'Test not found' });
          }
        } catch (error) {
          res.status(500).json({ message: 'Error deleting test', error });
        }
      });

      router.get('/user-details/:userId', async (req, res) => {
        const userId = req.params.userId;  // Ensure req.user exists
        console.log(userId)
      
        try {
          const user = await User.findById(userId);  // Use await instead of callback
          if (!user) {
            return res.status(400).json({ message: 'User not found' });
          }
          res.json({ username: user.displayName, rollNo: user.rollno });
        } catch (err) {
          console.error('Error fetching user details:', err);
          res.status(500).json({ message: 'Error fetching user details' });
        }
      });

      router.get('/tests-details/:userId', async (req, res) => {
        const userId = req.params.userId;  // Ensure req.user exists
      
        try {
          // Fetch upcoming tests
          const upcomingTests = await Test.find({ startTime: { $gt: Date.now() } });
      
          // Fetch user test history and determine attended/completed tests
          console.log(userId)
          const history = await History.find({ userId });
          console.log(history)
          const attendedTests = [];
          const completedTests = [];
      
          for (const entry of history) {
            const test = await Test.findById(entry.topicId);  // Use async/await
            console.log(test)
            if (test) {
              if (entry.testStatus) {
                completedTests.push({ id: test._id, name: test.topic, date: test.startTime });
                attendedTests.push({ id: test._id, name: test.topic, date: test.startTime });
              } else {
                attendedTests.push({ id: test._id, name: test.topic, date: test.startTime });
              }
            }
          }
      
          res.json({
            upcoming: upcomingTests.map(test => ({ id: test._id, name: test.topic, date: test.startTime })),
            attended: attendedTests,
            completed: completedTests,
          });
        } catch (error) {
          console.error('Error fetching tests:', error);
          res.status(500).json({ message: 'Error fetching tests' });
        }
      });

      router.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching users' });
        }
      });

      router.get('/users/search', async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }
      
        try {
            const regex = new RegExp(query, 'i'); // 'i' makes it case-insensitive
            const users = await User.find({
                $or: [
                    { name: { $regex: regex } },
                    { rollNumber: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            });
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error searching for users' });
        }
      });

      router.get('/users-info/:userId', async (req, res) => {
        const { userId } = req.params;
      
        try {
            const user = await User.findById(userId); // Find user by userId
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user); // Return user data
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ error: 'Error fetching user details' });
        }
      });

      router.get('/performance/:userId', async (req, res) => {
        const { userId } = req.params;
      
        try {
            const history = await History.find({ userId :userId}); // Find history by userId
      
            if (!history || history.length === 0) {
                return res.status(404).json({ error: 'No history found for this user' });
            }
      
            let attended = 0;
            let completed = 0;
      
            history.forEach(entry => {
                if (entry.testStatus === true) {
                    completed++;
                    attended++; // Completed also counts as attended
                } else {
                    attended++; // Attended but not completed
                }
            });
      
            res.json({ history, attended, completed }); // Return history, attended, and completed
        } catch (error) {
            console.error('Error fetching test history:', error);
            res.status(500).json({ error: 'Error fetching test history' });
        }
      });

      router.get('/api/analytics', async (req, res) => {
        try {
          // Get total number of tests conducted
          const totalTests = await Test.countDocuments();
      
          // Get number of attended tests (i.e., entries in History)
          const totalAttended = await History.countDocuments();
      
          // Get number of completed tests (testStatus = true in History)
          const totalCompleted = await History.countDocuments({ testStatus: true });
      
          // Send the data back as JSON
          res.json({
            totalTests,
            totalAttended,
            totalCompleted,
          });
        } catch (error) {
          console.error('Error fetching analytics data:', error);
          res.status(500).json({ message: 'Error fetching analytics data' });
        }
      });

      router.get('/students-attended-details', async (req, res) => {
        try {
          // Fetch all history records where tests have been attended
          const historyRecords = await History.find();
      
          // Create an array of promises to fetch user details for each history record
          const studentDetails = await Promise.all(
            historyRecords.map(async (record) => {
              // Fetch the user details using the userId from the history record
              const user = await User.findById(record.userId);
              return {
                rollNumber: user ? user.rollNo : 'Roll number not found', // Assuming rollNumber is stored in User model
                name: user ? user.displayName : 'Name not found',
                email: user ? user.email : 'Email not found',
                completed: record.testStatus ? 'Completed' : 'Not Completed', // Assuming testStatus indicates completion
                userId: record._id, // This is needed for 'View Code' button
              };
            })
          );
      
          res.json(studentDetails);
        } catch (error) {
          console.error('Error fetching students attended:', error);
          res.status(500).json({ message: 'Error fetching students attended' });
        }
      });

      router.get('/students-completed-details', async (req, res) => {
        try {
          // Find all history entries where testStatus is true (i.e., completed tests)
          const completedHistoryRecords = await History.find({ testStatus: true });
          
      
          if (!completedHistoryRecords || completedHistoryRecords.length === 0) {
            return res.status(404).json({ message: 'No students have completed tests.' });
          }
      
          // Map over completed history records to fetch user details
          const completedStudents = await Promise.all(
            completedHistoryRecords.map(async (record) => {
              try {
                // Use userId from the history record to find the user
                const user = await User.findById(record.userId);
                if (!user) {
                  console.error(`No user found for ID: ${record.userId}`);
                  return null; // Skip if no user found
                }
      
                // Return user details and completion status
                return {
                  rollNo: user.rollNo,   // Get roll number from User model
                  name: user.displayName,           // Get name from User model
                  email: user.email,         // Get email from User model
                  completed: record.testStatus ? 'Completed' : 'Not Completed',
                  userId: record._id,     // Include userId for the View Code button
                };
              } catch (error) {
                console.error('Error fetching user:', error);
                return null; // Skip if error fetching user
              }
            })
          );
      
          // Filter out any null entries (where no user was found)
          const filteredStudents = completedStudents.filter(student => student !== null);
      
          // Send the filtered data
          res.json({ completedStudents: filteredStudents });
        } catch (error) {
          console.error('Error fetching completed students:', error);
          res.status(500).json({ error: 'Server error while fetching completed students.' });
        }
      });

      router.put('/update-test-status/:testId', async (req, res) => {
        const { testId } = req.params;
        const { status } = req.body;
      
        try {
          const updatedTest = await History.findByIdAndUpdate(
            testId,
            { testStatus: status },
            { new: true }
          );
      
          if (updatedTest) {
            res.json({ message: 'Test status updated successfully' });
          } else {
            res.status(404).json({ message: 'Test not found' });
          }
        } catch (error) {
          res.status(500).json({ message: 'Error updating test status', error });
        }
      });
      
      module.exports = router;