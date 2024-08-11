const express = require('express')
const session = require('express-session');
const passport = require('passport');
const router = express.Router()

function isLoggedIn(req, res, next) {
  console.log(req.user)
  req.user ? next() : res.sendStatus(401);
}

router.get('/api/auth/status', (req, res) => {
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('Session:', req.session);
  console.log('User:', req.user);

  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      userId: req.user._id // Include the user ID in the response
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});



router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/protected',
    failureRedirect: 'http://localhost:3000/login'
  })
);

router.get('/api/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      message: `Hello ${req.user.displayName}`, // Customize based on your User model
      role: req.user.role // Ensure this is being set in your user model
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


router.get('/api/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send('Goodbye!');
  });
});


module.exports = router;