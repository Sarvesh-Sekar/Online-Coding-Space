const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { type: String, required: true },
  problemId: { type: String, required: true },
  code: { type: String, required: true },
  filename: { type: String, required: true },
  language: { type: String, required: true },
  submittedTime: { type: Date, required: true },
  completed: { type: Boolean, required: true },
});

const History = mongoose.model('History', HistorySchema);
module.exports = History;
