const Movie = require('../models/movies');

// Home page => GET
exports.getMovies = (req, res) => {
  Promise.all([
    Movie.fetchListMovies(),
    Movie.getMovieGenres(),
    Movie.getMoviesRatings(),
  ])
    .then(([{ data }, [genres], [moviesRatingData]]) => {
      res.render('index', {
        pageTitle: 'Movies',
        path: '/',
        movies: data.movies,
        moviesRatingData: moviesRatingData,
        genres: genres,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(() => {
      res.render('error', {
        pageTitle: 'Page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// Search for movies => GET
exports.searchMovies = (req, res) => {
  const searchTerm = req.query.query_term;
  const searchGenre = req.query.genre;

  Promise.all([
    Movie.fetchSearchMovie(searchTerm, searchGenre),
    Movie.getMovieGenres(),
    Movie.getMoviesRatings(),
  ])
    .then(([{ data }, [genres], [moviesRatingData]]) => {
      res.render('index', {
        pageTitle: 'Movies',
        path: '/',
        movies: data.movies,
        genres: genres,
        moviesRatingData: moviesRatingData,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(() => {
      res.render('error', {
        pageTitle: 'Page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// Movie details page => GET
exports.getMovieDetails = (req, res) => {
  const movieId = req.params.movieId;

  Promise.all([
    Movie.fetchMovieDetails(movieId),
    Movie.getMovieGenres(),
    Movie.getMovieRating(movieId),
  ])
    .then(([{ data }, [genres], [movieData]]) => {
      const rating = { totalVotes: 0, averageRating: 0 };

      if (movieData.length !== 0) {
        rating.totalVotes = parseInt(movieData[0].totalVotes);
        rating.averageRating = Number(movieData[0].averageRate).toFixed(1);
      }

      res.render('movie-details', {
        message: '',
        pageTitle: 'Movie',
        path: '/movieId=:movieId',
        movie: data.movie,
        genres: genres,
        averageRating: rating.averageRating,
        totalVotes: rating.totalVotes,
        isAuthenticated: req.session.isLoggedIn,
        message: req.flash('message'),
      });
    })
    .catch(() => {
      res.render('error', {
        pageTitle: 'Page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// Rating the movie on movie details page => POST
exports.postMovieRate = (req, res) => {
  const movie_id = req.params.movieId;
  const movie_rate = req.body.rating;
  const user_id = req.session.user.id;

  const movie = new Movie(movie_id, movie_rate, user_id);

  movie
    .saveMovieRate()
    .then(() => {
      res.redirect(`/movieId=${movie_id}`);
    })
    .catch((err) => {
      if (err.sqlState === '23000') {
        req.flash('message', "You've already rated this film!");
        return res.redirect(`/movieId=${movie_id}`);
      }

      res.render('error', {
        pageTitle: 'Page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};
