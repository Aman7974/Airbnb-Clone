const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/asycwrap.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema, reviewSchema } =  require("../schema.js");
//Require Export Model
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Route
//This will delete objectId too
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;