const Listing=require("./models/listing");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/expressError.js");



module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;//to store the url that user wanted to access before login
    req.flash("error","You must be logged in to create a new listing");
     return res.redirect("/login");
  }
  next();   
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async(req,res,next)=>{
  let id=req.params.id;
    let listing=await Listing.findById(id)
    if(  !listing.owner.equals(res.locals.currentUser._id)){
      req.flash("error" , "You do not have the permission to edit this listing");
      //return very important as if not written the next part of if will also run
      return res.redirect(`/listings/${id}`);
     }
     next(); 
    } 

  module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
};

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
};