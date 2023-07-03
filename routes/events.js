const express = require('express');
const multer = require('multer');
const Event = require('../models/Event');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../authMiddleware');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/create', authMiddleware, upload.single('flyer'), async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({ error: 'Flyer file is missing.' });
    }

    const { name, date, location, investmentTarget, description, expectedAttendance, ticketPricing, eventSchedule, marketingPlan, sponsorshipDetails, venueDetails, budgetBreakdown, profitSharingDetails, contingencyPlans } = req.body;

    const user = await User.findById(req.user._id);
    if (user.userType !== 'promoter') {
      return res.status(403).json({ error: 'Only promoters can create events.' });
    }

    const newEvent = new Event({
      name,
      date: new Date(date),
      location,
      promoter: user._id,
      promoterId: user._id, // Set the promoterId field
      investmentTarget: parseInt(investmentTarget),
      investmentReceived: 0,
      investors: [],
      description,
      flyer: `/uploads/${req.file.filename}`,
      expectedAttendance,
      ticketPricing,
      eventSchedule,
      marketingPlan,
      sponsorshipDetails,
      venueDetails,
      budgetBreakdown,
      profitSharingDetails,
      contingencyPlans,
    });

    const savedEvent = await newEvent.save();
    user.createdEvents.push(savedEvent._id);
    await user.save();

    res.json(savedEvent);
  } catch (error) {
    res.status(400).json({ error: 'Error creating event.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events.' });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is missing.' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event.' });
  }
});

router.get('/:eventId/messages', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is missing.' });
    }
    const messages = await Message.find({ eventId });
    if (!messages) {
      return res.status(404).json({ error: 'No messages found for this event.' });
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages.' });
  }
});

module.exports = router;
