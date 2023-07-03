const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['promoter', 'investor'] },
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('User', UserSchema);
