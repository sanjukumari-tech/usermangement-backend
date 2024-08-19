
// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'  // Reference to the Member model
  }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;







// // models/Event.js
// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   date: { type: Date, required: true },
//   capacity: { type: Number, required: true },
//   price: { type: Number, required: true },
//   attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// });

// EventSchema.virtual('percentageFilled').get(function () {
//   return (this.attendees.length / this.capacity) * 100;
// });

// module.exports = mongoose.model('Event', EventSchema);
