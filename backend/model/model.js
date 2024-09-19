const mongoose = require('mongoose')
require('dotenv').config()
const primaryConnection = mongoose.createConnection(process.env.MONGO_URI2);

const questionSchema = new mongoose.Schema({
  questionId: String,
  title: String,
  description: String,
  sampleTestCase: String,
  numberOfTestCases: Number,
  testCases: [
    {
      inputs: [String],
      outputs: [String],
    },
  ],
});

const testSchema = new mongoose.Schema({
  customId: String,
  topic: String,
  questionsToAttend: Number, // New field
  fromTime: Date, // New field
  toTime: Date, // New field
  questions: [questionSchema],
});




  


  module.exports = primaryConnection.model('Test', testSchema);