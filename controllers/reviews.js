const Listing =require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview=async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("success"," New Review Added");
  // res.send("new review added");
  res.redirect(`/listings/${listing._id}`);
  
}
module.exports.deleteReview=async (req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//yahan await nhi lagaya tha to vo update vala nhi hua yaani pull nhi hua pehle hi delete vala chal padha to review delete hogya pr vo listing ke andar se review ki id delte nhi hogi 
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}