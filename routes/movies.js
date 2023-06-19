const express = require('express');

const moviesController = require('../controllers/movie-controllers');

const router = express.Router();

router.get('/', moviesController.getMovies);
router.get('/search', moviesController.searchMovies);
router.get('/movieId=:movieId', moviesController.getMovieDetails);
router.post('/movieId=:movieId', moviesController.postMovieRate);

module.exports = router;
