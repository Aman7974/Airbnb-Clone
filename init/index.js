//Requiring Mongoose
const mongoose = require("mongoose");

//Require Data
const initData = require("./data.js");

//Require Listing
const Listing = require("../models/listing.js");

//Mongoose Connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//Promise Return error catching
main()
   .then(() => {
        console.log("connected to DB");
    }).catch ((err) => {
        console.log(err);
    });

    //Mongoose Connection
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "680442fcd57924aab03e4dab"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();

