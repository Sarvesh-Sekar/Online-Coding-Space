const mongoose = require('mongoose')
require('dotenv').config()
const primaryConnection = mongoose.createConnection(process.env.MONGO_URI2);

const questionSchema = new mongoose.Schema({
  questionId: String,
  title : String,
  description: String,
sampleTestCase : String,
  numberOfTestCases: Number,
  testCases: [
    {
      inputs: [String],  // Array of strings for multiple inputs in each test case
      outputs: [String],// Array of strings for multiple outputs in each test case 
    },
  ],
});
  const testSchema = new mongoose.Schema({
    customId: String,
    topic: String,
    
    questions: [questionSchema],
  });



  


  module.exports = primaryConnection.model('Test', testSchema);