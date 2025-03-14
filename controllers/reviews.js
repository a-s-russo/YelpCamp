import { Review } from "../models/review.js";
import { Campground } from "../models/campground.js";

export const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully created review.");
  res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reveiws: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review.");
  res.redirect(`/campgrounds/${id}`);
};
