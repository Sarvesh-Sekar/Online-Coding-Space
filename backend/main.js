const express = require('express');

const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

require('./controller/passport');

require('dotenv').config();


mongoose.connect("mongodb://localhost:27017/auth")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
// Create the second connection


const app = express();

app.use(express.json());



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI3 }), // Use MongoDB to store sessions
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());






app.use(require('./router/auth'))
app.use(require('./router/adminRoutes'))
app.use(require('./router/commonRoute'))
app.use(require('./router/codeRunner'))
app.use(require('./router/userRoutes'))


app.listen(5000, () => console.log('Listening on port 5000'));
