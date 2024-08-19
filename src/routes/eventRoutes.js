// routes/eventRoutes.js
const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Create Event
router.post('/create', ensureAuthenticated, async (req, res) => {
  const { name, description, date, capacity, price } = req.body;

  const newEvent = new Event({
    name,
    description,
    date,
    capacity,
    price,
    createdBy: req.user._id,
  });

  await newEvent.save();
  res.redirect('/events');
});

// Register for Event
router.post('/register/:eventId', ensureAuthenticated, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).send('Event not found');

  if (event.attendees.includes(req.user._id)) {
    return res.status(400).send('You are already registered for this event');
  }

  if (event.attendees.length >= event.capacity) {
    return res.status(400).send('Event is sold out');
  }

  event.attendees.push(req.user._id);
  await event.save();

  req.user.eventsRegistered.push(event._id);
  await req.user.save();

  res.redirect('/events');
});

// Cancel Event
router.post('/cancel/:eventId', ensureAuthenticated, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).send('Event not found');

  const daysRemaining = (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24);
  if (event.attendees.length > 0 || daysRemaining <= process.env.CANCEL_DAYS) {
    return res.status(400).send('Cannot cancel event');
  }

  await event.remove();
  res.redirect('/events');
});

// Get All Events
router.get('/', async (req, res) => {
  const events = await Event.find().populate('attendees', 'name');
  res.render('events', { events });
});

// Get Events by User
router.get('/user/:userId', async (req, res) => {
  const events = await Event.find({ createdBy: req.params.userId });
  res.render('userEvents', { events });
});

// Get Events Registered by User
router.get('/registered', ensureAuthenticated, async (req, res) => {
  await req.user.populate('eventsRegistered').execPopulate();
  res.render('registeredEvents', { events: req.user.eventsRegistered });
});

module.exports = router;
