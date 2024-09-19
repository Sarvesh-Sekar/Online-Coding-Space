const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { type: String, required: true },
  topicId: { type: String, required: true }, // New field to store the topic ID
  questionToAnswer: { type: Number, required: true }, // Number of questions to answer
  questionCompleted : {type : Number,default :0},
  questionsSubmitted: [{
    problemId: { type: String, required: true }, // Array to store completed questions
    code: { type: String, required: true },
    filename: { type: String, required: true },
    language: { type: String, required: true },
    submittedTime: { type: Date, required: true },
    completed: { type: Boolean, required: true }
  }],
  testStatus:{type:Boolean,default:false},
  testCompletedTime:{type:Date}
});

const History = mongoose.model('History', HistorySchema);
module.exports = History;
