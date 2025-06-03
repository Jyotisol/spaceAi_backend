const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'eventScheduler';

let db;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected to MongoDB at:', url); // Debug log
  db = client.db(dbName);
  return db;
}

module.exports = connectDB;