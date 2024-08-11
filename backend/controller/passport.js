const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User'); // Adjust the path to your User model

passport.serializeUser((user, done) => {
  done(null, user._id); // Use the default '_id' field
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // This will search by '_id'
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        role: 'user'
      }).save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

