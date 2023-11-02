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
    userId: req.user.id
  });

  try {
    const savedAnime = await anime.save();
    res.status(201).json(savedAnime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.animeId);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
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
    const removedAnime = await Anime.deleteOne({ _id: req.params.animeId });
    if (removedAnime.deletedCount === 0) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.status(200).json(removedAnime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToMyList = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const anime = await Anime.findById(req.params.animeId);
      if (!anime) {
        return res.status(404).json({ message: "Anime not found" });
      }
      
      if (user.animeList && user.animeList.includes(req.params.animeId)) {
        return res.redirect(`/users/search?query=${req.query.query}&message=Anime already in your list`);
    }
      
      user.animeList = user.animeList || [];
      user.animeList.push(anime.id);
      await user.save();
  
      res.redirect(`/users/search?query=${req.query.query}&message=Anime added successfully!`);
      
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.removeFromMyList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.animeList.includes(req.params.animeId)) {
            return res.status(400).json({ message: "Anime not in your list" });
        }

        // Filter out the anime to remove it from the list
        user.animeList = user.animeList.filter(animeId => animeId.toString() !== req.params.animeId);
        await user.save();

        res.status(200).json({ message: "Anime removed from your list" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

