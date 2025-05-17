//Requiring Mongoose
const mongoose = require("mongoose");

//Requiring Review
const Review = require("./review.js");

//Storing mongoose schema in schema variable
const Schema = mongoose.Schema;

//Creating Schema Details
const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        maxLength: 300
    },

    image:{
        url: String,
        filename: String,
    },
    
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//mongoose middleware 
//This will delete reviews from database as we delete whole listing
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

//Create Model
const Listing = mongoose.model("Listing", listingSchema);

//File export to app.js
module.exports = Listing;