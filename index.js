const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

// Create a MongoClient
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Select the database
    const db = client.db('database_pfe');
    const collection = db.collection('users');

    // Example: Insert a document
    await collection.insertOne({ name: 'John Doe', email: 'john@example.com' });
    console.log('Document inserted');

    // Example: Query documents
    const users = await collection.find({}).toArray();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Run the connection
connectToMongoDB();

// Basic Express route
app.get('/', (req, res) => {
  res.send('Node.js with MongoDB Atlas!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});