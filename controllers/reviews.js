const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let review =new Review(req.body.review);

    review.author = req.user._id; //set the author
    await review.save();
    
    listing.reviews.push(review);

    
    await listing.save();
    req.flash("success", "review created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res) => {
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};