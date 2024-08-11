const mongoose = require('mongoose');
require('dotenv').config();

const secondaryConnection = mongoose.createConnection(process.env.MONGO_URI);

const historySchema = new mongoose.Schema({
  problemId: String,
  fileName: String,
  language: String,
  code: String,
  submittedTime: Date,
  completed: {type:Boolean,default:false},
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  email: String,
  role: String
});

// No need to add a custom 'id' field since '_id' is automatically generated and unique


const User = secondaryConnection.model('User', userSchema);

module.exports = User;
