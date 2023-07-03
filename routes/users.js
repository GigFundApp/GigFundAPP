const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const authMiddleware = require(path.join('/Users/trebla/gigfundapp', 'authMiddleware'));

// Register a new user
router.post('/register', async (req, res) => {
  // Check if the email is already in use
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json('Error: Email is already in use');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    userType: req.body.userType
  });

  // Try to save the user and handle errors
  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/login', async (req, res) => {
  // Find user in the database
  const user = await User.findOne({ email: req.body.email });

  // Send error if user doesn't exist
  if (!user) return res.status(400).send('Email or password is wrong');

  // Check password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Email or password is wrong');

  // Create and assign a token with a longer expiration time
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1y' });

  // Set the Content-Type header and send the token as a JSON object in the response body
  res.header('Content-Type', 'application/json').json({ token });
});



router.get('/profile', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  
  try {
    const user = await User.findById(userId).populate('createdEvents').exec();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(400).json({ error: 'Error fetching user profile.' });
  }
});

// GET /users/me
router.get('/me', authMiddleware, (req, res) => {
  res.send(req.user); // req.user contains the authenticated user, added by the authMiddleware middleware
});

module.exports = router;
