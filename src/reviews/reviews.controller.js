const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Checks if review exists
const reviewExists = async (req, res, next) => {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
};

//Returns updated review
const update = async (req, res, next) => {
  const review = res.locals.review.review_id;
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await reviewsService.update(updatedReview);
  res.json({ data: await reviewsService.read(review) });
};

//Deletes review
const destroy = async (req, res, next) => {
  await reviewsService.delete(res.locals.review.review_id);
  res.sendStatus(204);
};

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};