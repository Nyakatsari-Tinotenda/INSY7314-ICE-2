// controllers/movieController.js
// Contains the business logic for the /api/movies resource.
// Uses a temporary in-memory array in place of a real database.

// Each movie has 6 attributes including its id: id, title, director, genre, releaseYear, rating
const movies = [
  {
    id: 'm1',
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    rating: 8.8
  },
  {
    id: 'm2',
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: 'Drama',
    releaseYear: 1994,
    rating: 9.3
  }
];

const getAllMovies = (req, res) => {
  // Only return selected fields. This is an important secure development habit -
  // an API should avoid exposing unnecessary fields in a listing response.
  const safeMovies = movies.map(({ id, title, director, genre, releaseYear }) => ({
    id,
    title,
    director,
    genre,
    releaseYear
  }));

  res.status(200).json({
    count: safeMovies.length,
    data: safeMovies
  });
};

const getMovieById = (req, res) => {
  const { id } = req.params;

  // Basic allow-list validation on the route parameter before it is used to search data.
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid movie ID format' });
  }

  const movie = movies.find((item) => item.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.status(200).json({ data: movie });
};

const createMovie = (req, res) => {
  // req.body has already been validated and cleaned by validateMovieInput middleware.
  const { title, director, genre, releaseYear, rating } = req.body;

  const newMovie = {
    id: `m${movies.length + 1}`,
    title,
    director,
    genre,
    releaseYear,
    rating
  };

  movies.push(newMovie);

  res.status(201).json({
    message: 'Movie created',
    data: newMovie
  });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie
};
