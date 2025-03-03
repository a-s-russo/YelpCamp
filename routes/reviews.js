import * as reviews from "../controllers/reviews.js";
import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

export default router;
