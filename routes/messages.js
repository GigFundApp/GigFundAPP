const express = require('express');
const authMiddleware = require('../authMiddleware');
const Message = require('../models/Message');
const Event = require('../models/Event');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { eventId, content } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const newMessage = new Message({
      eventId,
      senderId,
      receiverId: event.promoterId || event.promoter, // Use promoterId if available, otherwise use promoter
      content,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

router.get('/event/:eventId', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const messages = await Message.find({ eventId });

    res.json(messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the messages.' });
  }
});

module.exports = router;
