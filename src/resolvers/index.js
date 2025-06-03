const Event = require('../models/Event');
const mongoose = require('mongoose');

const resolvers = {
  Event: {
    id: (parent) => parent._id.toString(),
  },
  Query: {
    events: async () => {
      try {
        return await Event.findAllUpcoming();
      } catch (error) {
        console.error('events error:', error);
        throw new Error(`Failed to fetch events: ${error.message}`);
      }
    },
    event: async (_, { id }) => {
      try {
        return await Event.findById(id);
      } catch (error) {
        console.error('event error:', error);
        throw new Error(`Failed to fetch event: ${error.message}`);
      }
    },
    eventsByDateRange: async (_, { start, end }) => {
      try {
        console.log('eventsByDateRange args:', { start, end });
        const events = await Event.findByDateRange(start, end);
        console.log('eventsByDateRange result:', events.length, events);
        return events;
      } catch (error) {
        console.error('eventsByDateRange error:', error.message, error.stack);
        throw new Error(`Failed to fetch events: ${error.message}`);
      }
    },
  },
  Mutation: {
    addEvent: async (_, args) => {
      if (new Date(args.startTime) >= new Date(args.endTime)) {
        throw new Error('Start time must be before end time');
      }
      try {
        const event = await Event.create(args);
        console.log('Resolver Created Event:', event);
        return event;
      } catch (error) {
        console.error('addEvent error:', error);
        throw new Error(`Failed to create event: ${error.message}`);
      }
    },
    updateEvent: async (_, { id, ...updates }) => {
      if (
        updates.startTime &&
        updates.endTime &&
        new Date(updates.startTime) >= new Date(updates.endTime)
      ) {
        throw new Error('Start time must be before end time');
      }
      try {
        await Event.update(id, updates);
        return await Event.findById(id);
      } catch (error) {
        console.error('updateEvent error:', error);
        throw new Error(`Failed to update event: ${error.message}`);
      }
    },
   deleteEvent: async (_, { id }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const result = await Event.delete(id);
    return result.deletedCount === 1;
  } catch (error) {
    console.error('deleteEvent error:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
},
  },
};

module.exports = resolvers;