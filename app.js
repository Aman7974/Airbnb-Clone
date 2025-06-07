if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// Requiring Express
const express = require("express");
// Storing express package in app  
const app = express();

//Requiring Mongoose
const mongoose = require("mongoose");

//Require Path
const path = require("path");

//Require Method Override
const methodOverride = require("method-override");

//Require EJS-Mate- Helps us to create boilerplate code(that is same for whole website)
const engine = require("ejs-mate");

//Mongoose Connection URL
// const dbUrl = process.env.ATLASDB_URL;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const wrapAsync = require("./utils/asycwrap.js");
const ExpressError = require("./utils/ExpressError.js");
 const { listingSchema, reviewSchema } =  require("./schema.js");
 //Require Export model 
const Listing = require("./models/listing.js");

//Require Export Model
const Review = require("./models/review.js");

//Require Express-session
const session = require("express-session");
const MongoStore = require("connect-mongo");

//Require Connect-Flash
const flash = require("connect-flash");

//Require Passport
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error", () => {
//     console.log("ERROR in MONGO SESSION STORE", err);
// });

const sessionOptions = {
    // store, 
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//Session is required for passport usage
app.use(session(sessionOptions));
app.use(flash());

//Implement passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to flash message
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log("req.user:", req.user);
    res.locals.currUser = req.user;
    next(); 
})

app.get("/demouser", async (req,res) => {
    let fakeUser = new User({
        email: "student@gmailcom",
        username: "aman-pachouri"
    });

   let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

//Disable strict Populate
// mongoose.set("strictPopulate", false);

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
}

//Set ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", engine);

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Middleware - Async function
app.use((err, req,res,next) => {
    let { statusCode=500, message="Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});

//Server Start/Port Selection
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});  