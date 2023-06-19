const db = require('../util/database');

const URL = 'https://yts.mx/api/v2/';

module.exports = class Movie {
  constructor(movie_id, rate, user_id) {
    this.movie_id = movie_id;
    this.rate = rate;
    this.user_id = user_id;
  }

  saveMovieRate() {
    return db.execute(
      `INSERT INTO movies (
      movie_id, 
      rate, 
      user_id) 
    VALUES (?, ?, ?)`,
      [this.movie_id, this.rate, this.user_id]
    );
  }

  static fetchListMovies = async () => {
    try {
      const response = await fetch(`${URL}list_movies.json?sort_by=year`);

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static getMovieRating = async (movieId) => {
    return db.execute(
      `SELECT 
        movie_id AS movieId, 
        AVG(rate) AS averageRate,
        COUNT(*) AS totalVotes
      FROM bambino.movies
      GROUP BY movie_id
      HAVING movie_id = ${movieId}`
    );
  };

  static getMoviesRatings = async () => {
    return db.execute(
      `SELECT 
        movie_id AS movieId, 
        AVG(rate) AS averageRate,
        COUNT(*) AS totalVotes
      FROM bambino.movies
      GROUP BY movie_id`
    );
  };

  static fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${URL}movie_details.json?movie_id=${movieId}&with_images=true`
      );

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static fetchSearchMovie = async (searchTerm, searchGenre) => {
    try {
      const response = await fetch(
        `${URL}list_movies.json?query_term=${searchTerm}&genre=${searchGenre}`
      );

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  static getMovieGenres() {
    return db.execute('SELECT genre FROM bambino.`movie-genres`;');
  }
};
