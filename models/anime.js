const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const AnimeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  genre: [String],
  description: String,
  rating: Number,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [CommentSchema]
});

const Anime = mongoose.model('Anime', AnimeSchema);
module.exports = Anime;