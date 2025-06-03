const { ObjectId } = require('mongodb');
const connectDB = require('../db');

class Event {
  static async getCollection() {
    try {
      const db = await connectDB();
      return db.collection('events');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }

  static async findAllUpcoming() {
    const collection = await this.getCollection();
    return collection
      .find({ startTime: { $gte: new Date() } })
      .sort({ startTime: 1 })
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    const event = await collection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      throw new Error(`Event not found for ID: ${id}`);
    }
    return event;
  }

  static async findByDateRange(start, end) {
    const collection = await this.getCollection();
    try {
      const startDate = start ? new Date(start) : new Date('2025-06-01');
      const endDate = end ? new Date(end) : new Date('2025-07-31');
      console.log('findByDateRange input:', { start, end, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date format:', { start, end });
        throw new Error('Invalid date format');
      }
      console.log('Querying events between:', startDate.toISOString(), endDate.toISOString());
      const events = await collection
        .find({
          startTime: { $gte: startDate },
          endTime: { $lte: endDate },
        })
        .sort({ startTime: 1 })
        .toArray();
      const formattedEvents = events.map(event => ({
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
      }));
      console.log('Found events:', events.length, formattedEvents);
      return formattedEvents;
    } catch (error) {
      console.error('findByDateRange error:', error.message, error.stack);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  static async create(event) {
    const collection = await this.getCollection();
    try {
      const { startTime, endTime, ...rest } = event;
      const insertData = {
        ...rest,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      };
      console.log('Inserting Event:', insertData);
      const result = await collection.insertOne(insertData);
      const insertedEvent = {
        _id: result.insertedId,
        ...insertData,
        startTime: insertData.startTime.toISOString(),
        endTime: insertData.endTime.toISOString(),
      };
      console.log('Inserted Event:', insertedEvent);
      return insertedEvent;
    } catch (error) {
      console.error('create error:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    return collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          startTime: updates.startTime ? new Date(updates.startTime) : undefined,
          endTime: updates.endTime ? new Date(updates.endTime) : undefined,
        },
      }
    );
  }

  static async delete(id) {
    const collection = await this.getCollection();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Event;