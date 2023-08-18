const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const movieExists = async (req, res, next) => {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
};

const read = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.read(movie) });
};

//Returns theaters showing a specific movie.
const readTheatersByMovie = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.readTheatersByMovie(movie) });
};

//Returns reviews for a specific movie.
const readReviewsByMovie = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.readReviewsByMovie(movie) });
};

//returns a list of movies.
const list = async (req, res, next) => {
    if (req.query.is_showing === "true") {
      const currentlyShowing = await moviesService.listMoviesCurrentlyShowing();
      res.json({ data: currentlyShowing });
    } else {
      const allMovies = await moviesService.list();
      res.json({ data: allMovies });
    }
  };

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readTheatersByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersByMovie),
  ],
  readReviewsByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviewsByMovie),
  ],
};