const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI || process.env.mongo_db_url;

if (!mongoURI) {
  console.error('MongoDB URI is missing. Set MONGO_URI in your .env file.');
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
      console.error('Database not connected:', err.message);
    });
}

module.exports = mongoose;
