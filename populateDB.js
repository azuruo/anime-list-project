require('dotenv').config();
const mongoose = require('mongoose');
const Anime = require('./models/anime');
const animeData = require('./data/animeData');

// Ensure DATABASE_URL is loaded
const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('Error: Missing DATABASE_URL in .env file');
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Clear existing data
  await Anime.deleteMany();

  // Populate the database
  await Anime.insertMany(animeData);

  console.log('Anime data has been inserted successfully.');
  mongoose.connection.close();
});
