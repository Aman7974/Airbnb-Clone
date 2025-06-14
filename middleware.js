const Listing = require("./models/listing");
const Review = require("./models/review"); 
const ExpressError = require("./utils/ExpressError.js");
 const { listingSchema, reviewSchema  } =  require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    
    //Its a passport method to authenticate the user
    if (!req.isAuthenticated()) {
        //redirectUrl save
        req.session.redirectUrl =  req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
}

//Method 2 - Authorize the user Login
module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    //method 1 -: authorize loginuser- We have to implement this same code for editand create for same functionality
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
}

next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    //method 1 -: authorize loginuser- We have to implement this same code for editand create for same functionality
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
}
next();
};