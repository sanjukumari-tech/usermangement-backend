const express = require('express');
const Event = require('../models/EventModel');
const role = require('../middleware/role');
const auth = require('../middleware/auth'); // Ensure auth middleware is used

const router = express.Router();

// Get all events
router.get('/', auth, role(['admin', 'organizer', 'participant']), async (req, res) => {
  try {
    const events = await Event.find({ deleted: false }).populate('attendees');
    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events');
  }
});

// Create a new event (Organizer only)
router.post('/create', auth, role(['admin', 'organizer']), async (req, res) => {
  const { eventName, description, eventDate, capacity } = req.body;
  
  try {
    const newEvent = new Event({
      eventName,
      description,
      eventDate,
      capacity,
      createdBy: req.user._id, // Set the organizer's ID
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating event');
  }
});

// Update an event (Admin and Organizer who created the event)
router.patch('/update/:id', auth, role(['admin', 'organizer']), async (req, res) => {
  const { id } = req.params;
  const { eventName, description, eventDate, capacity } = req.body;
  
  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).send('Event not found');

    if (req.user.role !== 'admin' && !event.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event.eventName = eventName || event.eventName;
    event.description = description || event.description;
    event.eventDate = eventDate || event.eventDate;
    event.capacity = capacity || event.capacity;

    await event.save();
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating event');
  }
});

// Delete an event (Admin only)
router.delete('/delete/:id', auth, role(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).send('Event not found');

    event.deleted = true; // Soft delete
    await event.save();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting event');
  }
});

// Register for an event (Participant only)
router.post('/register/:id', auth, role(['participant']), async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).send('Event not found');

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: 'Successfully registered for the event', event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering for event');
  }
});

// View registered events (Participant only)
router.get('/my-events', auth, role(['participant']), async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id, deleted: false });
    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching registered events');
  }
});

module.exports = router;
