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




const { exec } = require('child_process'); // Assuming you use child_process to execute code





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
  
  router.get('/api/tests/:customId/questions', async (req, res) => {
    const { customId } = req.params;
  
    try {
      const test = await Test.findOne({ customId }).populate('questions');
      if (test) {
        res.json(test.questions);
      } else {
        res.status(404).json({ message: 'Test not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching questions', error });
    }
  });
  

  // Route to fetch a random question ID for a given test
  router.get('/api/tests/:customId/questions/random', async (req, res) => {
    const { customId } = req.params;
    const excludedId = req.query.excludedId; // Get the excluded ID from the query parameters
  
    try {
      // Find the test by customId
      const test = await Test.findOne({ customId }).populate('questions');
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      if (!test.questions || test.questions.length === 0) {
        return res.status(404).json({ message: 'No questions found in this test' });
      }
  
      // Filter out already fetched questions and the excluded question
      const availableQuestions = test.questions.filter(question => 
        question._id.toString() !== excludedId
      );
  
      if (availableQuestions.length === 0) {
        return res.status(404).json({ message: 'No more unique questions available' });
      }
  
      // Get a random question from the available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
  
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
  
  
  

router.get('/api/tests/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const test = await Test.findOne({ customId });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ topic: test.topic, numQuestions: test.questionsToAttend });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

  // router.get('/api/tests/:customId/questions/:questionId', async (req, res) => {
  //   const { customId, questionId } = req.params;
  
  //   console.log(`Received request to fetch question with ID: ${questionId} from test with custom ID: ${customId}`);
  
  //   try {
  //     // Find the test by customId
  //     const test = await Test.findOne({ customId }).populate('questions');
  
  //     if (!test) {
  //       console.log('Test not found');
  //       return res.status(404).json({ message: 'Test not found' });
  //     }
  
  //     //console.log(`Test found: ${test}`);
  
  //     // Find the question within the test
  //     const question = test.questions.find((q) => q.questionId.toString() === questionId);
  
  //     if (!question) {
  //       console.log('Question not found in this test');
  //       return res.status(404).json({ message: 'Question not found in this test' });
  //     }
  
  //     console.log(`Question found: ${question}`);
  
  //     // Send the question details
  //     res.json({
  //       title: question.title,
  //       description: question.description,
  //       sampleTestCase: question.sampleTestCase,
  //       numberOfTestCases: question.numberOfTestCases,
  //     });
  //   } catch (error) {
  //     console.error('Error fetching question', error);
  //     res.status(500).json({ message: 'Error fetching question', error });
  //   }
  // });

  

  router.post('/submit/:customId/:problemId', async (req, res) => {
    const { customId, problemId } = req.params;
    const { language, code, fileName } = req.body;
  
    // Validate ObjectId format
    console.log(problemId)
  
    try {
      const testDoc = await Test.findOne({ customId: customId });
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
  



// router.get('/testcase/:customId/:problemId', async (req, res) => {
//   const { customId, problemId } = req.params;

//   try {
//     const testDoc = await Test.findOne({ customId: customId });
//     if (!testDoc) {
//       return res.status(404).send('Test not found');
//     }

//     const problem = testDoc.questions.find(q => q.questionId === problemId);

//     if (!problem) {
//       console.log(testDoc);
//       return res.status(404).send('Problem not found');
//     } else {
//       // Combine all inputs and outputs from the test cases
//       const combinedInputs = [];
//       const combinedOutputs = [];
      
//       problem.testCases.forEach(testCase => {
//         combinedInputs.push(testCase.inputs.join(' '));
//         combinedOutputs.push(testCase.outputs.join(' '));
//       });

//       // Return the combined inputs and outputs
//       const combinedTestCases = {
//         input: combinedInputs,
//         output: combinedOutputs
//       };

//       console.log(combinedTestCases);
//       res.json(combinedTestCases);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// });

// router.post('/finish/:customId/:problemId', async (req, res) => {
//   const { customId, problemId } = req.params;
//   const { email, code, fileName, submittedTime } = req.body;

//   try {
//     // Save the solution data to the database
//     await db.saveSolution({
//       customId,
//       problemId,
//       email,
//       code,
//       fileName,
//       submittedTime
//     });

//     // Update the user's problem status to completed
//     await db.updateProblemStatus(customId, problemId, true);

//     res.status(200).send('Solution submitted and problem status updated.');
//   } catch (error) {
//     console.error('Error finishing solution:', error);
//     res.status(500).send('Error finishing solution.');
//   }
// });

router.get('/api/tests/:customId/questions/:userId', async (req, res) => {
  const { customId, userId } = req.params;

  try {
    // Fetch problems for the given test ID
    const problems = await Problem.find({ testId: customId });

    // Fetch user's history for these problems
    const history = await History.find({ userId: userId, problemId: { $in: problems.map(p => p._id) } });

    // Combine problems with completion status
    const problemsWithStatus = problems.map(problem => {
      const completed = history.some(h => h.problemId.equals(problem._id) && h.completed);
      return {
        ...problem.toObject(),
        completed
      };
    });

    res.json(problemsWithStatus);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problems' });
  }
});
router.get('/api/users/me', (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user after authentication
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ _id: user._id });
    })
    .catch(err => res.status(500).json({ error: 'Failed to fetch user' }));
});
  
router.post('/finish/:userId/:customId/:problemId', async (req, res) => {
  const { userId, customId, problemId } = req.params;
  const { language, code, filename, completed } = req.body;

  try {
    const testDoc = await Test.findOne({ customId });
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
        questionToAnswer: testDoc.questionsToAttend,
        questionCompleted: 0,
        questionsSubmitted: []
      });
    }

    // Add the current question submission
    historyEntry.questionsSubmitted.push({
      problemId,
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



router.get('/api/history/:userId/:problemId', async (req, res) => {
  const { userId, problemId } = req.params;

  try {
    const history = await History.findOne({ userId, problemId });
    if (history && history.completed) {
      res.json({ completed: true });
    } else {
      res.json({ completed: false });
    }
  } catch (error) {
    console.error('Error checking completion status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//admin routes

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

router.delete('/api/tests/:customId/questions/:questionId', async (req, res) => {
  try {
    const { customId, questionId } = req.params;

    const test = await Test.findOne({ customId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const questionIndex = test.questions.findIndex((q) => q.questionId === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    test.questions.splice(questionIndex, 1);
    await test.save();

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
});

router.get('/api/submissions/:customId/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {
    // Find all submissions for the given questionId
    const submissions = await History.find({ problemId: questionId });
    console.log(submissions.length)
    if (submissions.length > 0) {
      // Create an array of promises to fetch user details for each submission
      const submissionDetails = await Promise.all(
        submissions.map(async (submission) => {
          try {
            const user = await User.findById(submission.userId);
            return {
              email: user ? user.email : 'Email not found', // Get the email from the User model
              completed: submission.completed,
              userId: submission.userId,
            };
          } catch (userError) {
            console.error('Error fetching user:', userError);
            return {
              email: 'Email fetch error',
              completed: submission.completed,
              userId: submission.userId,
            };
          }
        })
      );

      res.json(submissionDetails);
    } else {
      res.status(404).json({ message: 'No submissions found for this problem' });
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
});


router.get('/api/code/:userId/:problemId', async (req, res) => {
  const { userId, problemId } = req.params;

  try {
    const submission = await History.findOne({ userId, problemId });

    if (submission) {
      res.json({
        code: submission.code,
        submissionTime: submission.submittedTime
      });
    } else {
      res.status(404).json({ message: 'No submission found for this user and problem' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching code', error });
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


//time
router.get('/time/tests/:customId', async (req, res) => {
  const { customId } = req.params;

  try {
    // Attempt to find the test data by customId
    const test = await Test.findOne({ customId });

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


    










