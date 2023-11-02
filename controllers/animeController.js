const Anime = require('../models/anime');
const User = require('../models/user');

exports.getAllAnime = async (req, res) => {
  try {
    const animeList = await Anime.find({ userId: req.user.id });
    res.status(200).json(animeList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAnime = async (req, res) => {
  const anime = new Anime({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    rating: req.body.rating,
    userId: req.user.id,
  });

  try {
    const savedAnime = await anime.save();
    res.redirect('/users/search?message=Anime created successfully!');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAnime = async (req, res) => {
  try {
    const updatedAnime = await Anime.updateOne(
      { _id: req.params.animeId },
      { $set: req.body }
    );
    res.status(200).json(updatedAnime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAnime = async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.animeId);
    res.redirect('/users/search?message=Anime removed successfully!');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addToMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const anime = await Anime.findById(req.params.animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    if (user.animeList && user.animeList.includes(req.params.animeId)) {
      return res.redirect(
        `/users/search?query=${req.query.query}&message=Anime already in your list`
      );
    }

    user.animeList = user.animeList || [];
    user.animeList.push(anime.id);
    await user.save();

    res.redirect(
      `/users/search?query=${req.query.query}&message=Anime added successfully!`
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.animeList.includes(req.params.animeId)) {
      return res.status(400).json({ message: 'Anime not in your list' });
    }

    // Filter out the anime to remove it from the list
    user.animeList = user.animeList.filter(
      (animeId) => animeId.toString() !== req.params.animeId
    );
    await user.save();

    res.status(200).json({ message: 'Anime removed from your list' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .json({ message: 'You must be logged in to add comments.' });
  }
  try {
    const anime = await Anime.findById(req.params.animeId);
    const user = await User.findById(req.user.id);
    const comment = {
      text: req.body.commentText,
      userId: user._id,
      userName: user.name,
      userProfilePicture: user.profilePicture,
      date: new Date(),
    };
    anime.comments.push(comment);
    await anime.save();
    res.redirect('/users/search');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .json({ message: 'You must be logged in to delete comments.' });
  }
  try {
    const anime = await Anime.findById(req.params.animeId);

    // Updated filtering logic to ensure only the comment's author can delete it
    anime.comments = anime.comments.filter(
      (comment) =>
        !(
          comment._id.toString() === req.params.commentId &&
          comment.userId.toString() === req.user._id.toString()
        )
    );

    await anime.save();
    res.redirect('/users/search');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
