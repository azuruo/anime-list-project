const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  animeList: [{
    type: Schema.Types.ObjectId,
    ref: 'Anime'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);