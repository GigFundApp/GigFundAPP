// routes/api/notifications.js

const express = require('express');
const router = express.Router();
const Notification = require('../../models/Notification');
const auth = require('../../middleware/auth');

// Create Notification
router.post('/', auth, async (req, res) => {
  try {
    const newNotification = new Notification({
      to: req.body.to,
      from: req.body.from,
      content: req.body.content,
    });

    const notification = await newNotification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Notifications for a User
router.get('/:id', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.params.id }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Notification
router.put('/:id', auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
