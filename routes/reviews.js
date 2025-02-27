import express from "express";
import { Campground } from "../models/campground.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Review } from "../models/review.js";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created review.");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reveiws: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review.");
    res.redirect(`/campgrounds/${id}`);
  })
);

export default router;
