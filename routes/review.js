const express=require("express");
const router = express.Router({mergeParams:true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const reviewControllers=require("../controllers/reviews.js");


const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
};



//REVIEWS POST ROUTE
router.post("/",validateReview,wrapAsync(reviewControllers.createReview));

// REVIEWS DELETE ROUTE
router.delete("/:reviewId", wrapAsync(reviewControllers.deleteReview));

module.exports=router;
