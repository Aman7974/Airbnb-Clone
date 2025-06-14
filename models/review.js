//Requiring Mongoose
const mongoose = require("mongoose");

//Storing mongoose schema in schema variable
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: Number,   
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);