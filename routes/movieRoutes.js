// routes/movieRoutes.js
// Defines the endpoints for the movies resource and links them
// to their controller functions and validation middleware.

const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  createMovie,
} = require("../controllers/movieController");

const validateMovieInput = require("../middleware/validateMovieInput");

// GET /api/movies - fetch all movies
router.get("/", getAllMovies);

// GET /api/movies/:id - fetch a single movie by id
router.get("/:id", getMovieById);

// POST /api/movies - create a new movie (runs input validation first)
router.post("/", validateMovieInput, createMovie);

module.exports = router;
