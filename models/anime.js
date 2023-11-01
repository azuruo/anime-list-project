const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  genre: [String],
  description: String,
  rating: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Anime = mongoose.model('Anime', AnimeSchema);
module.exports = Anime;
