const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/asycwrap.js");
// const ExpressError = require("../utils/ExpressError.js");
 const { listingSchema, reviewSchema } =  require("../schema.js");
 //Require Export model 
const Listing = require("../models/listing.js");
//Require middleware
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
//Multer - multipart data store package
const multer = require("multer"); //require multer
const { storage } = require("../cloudConfig.js"); 
const upload = multer({ storage }); //initialize multer

//Index Route
//WrapAsync async error handling

//router.route Method
//index and create route
router
 .route("/")
 
 .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
   upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show update and delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

  //edit
  router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );

module.exports = router;