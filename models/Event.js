const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  promoter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  promoterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field: promoterId
  investmentReceived: { type: Number, default: 0 },
  investmentTarget: { type: Number, required: true },
  investors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: { type: String, required: true },
  flyer: { type: String },
  expectedAttendance: { type: Number, required: true },
  ticketPricing: { type: String, required: true },
  eventSchedule: { type: String, required: true },
  marketingPlan: { type: String, required: true },
  sponsorshipDetails: { type: String, required: true },
  venueDetails: { type: String, required: true },
  budgetBreakdown: { type: String, required: true },
  profitSharingDetails: { type: String, required: true },
  contingencyPlans: { type: String, required: true },
});

module.exports = mongoose.model('Event', EventSchema);
