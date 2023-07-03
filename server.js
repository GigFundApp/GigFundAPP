const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Event = require('./models/Event');
const messagesRouter = require('./routes/messages');

// Initialize body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Allow to server to accept request from different origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Allow session cookie from browser to pass through
}));

app.use('/messages', messagesRouter);

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

// Import routers
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');

// Use routers
app.use('/users', usersRouter);
app.use('/events', eventsRouter);

// Serve event flyer images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, GigFundApp!');
});

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
