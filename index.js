const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userRoutes = require('./src/routes/user');

app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});