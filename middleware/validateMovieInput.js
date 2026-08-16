// middleware/validateMovieInput.js
// Validates the request body before a new movie is created.

const allowedGenres = [
  'Action',
  'Drama',
  'Comedy',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Documentary',
  'Animation'
];

const currentYear = new Date().getFullYear();

const validateMovieInput = (req, res, next) => {
  const { title, director, genre, releaseYear, rating } = req.body;

  if (!title || !director || !genre || releaseYear === undefined || rating === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (
    typeof title !== 'string' ||
    typeof director !== 'string' ||
    typeof genre !== 'string'
  ) {
    return res.status(400).json({ error: 'Title, director, and genre must be text values' });
  }

  if (typeof releaseYear !== 'number' || typeof rating !== 'number') {
    return res.status(400).json({ error: 'ReleaseYear and rating must be numbers' });
  }

  const trimmedTitle = title.trim();
  const trimmedDirector = director.trim();
  const trimmedGenre = genre.trim();

  if (trimmedTitle.length < 1 || trimmedTitle.length > 100) {
    return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
  }

  if (trimmedDirector.length < 2 || trimmedDirector.length > 60) {
    return res.status(400).json({ error: 'Director must be between 2 and 60 characters' });
  }

  if (!allowedGenres.includes(trimmedGenre)) {
    return res.status(400).json({
      error: `Genre must be one of: ${allowedGenres.join(', ')}`
    });
  }

  if (releaseYear < 1888 || releaseYear > currentYear + 1) {
    return res.status(400).json({ error: 'ReleaseYear must be a realistic year' });
  }

  if (rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'Rating must be a number between 0 and 10' });
  }

  // Replace the request body with cleaned values so the controller
  // receives data that has already been checked.
  req.body = {
    title: trimmedTitle,
    director: trimmedDirector,
    genre: trimmedGenre,
    releaseYear,
    rating
  };

  next();
};

module.exports = validateMovieInput;
