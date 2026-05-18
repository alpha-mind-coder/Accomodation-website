const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");
let listingControllers=require("../controllers/listings.js");


const { isLoggedIn,isOwner } = require("../middleware.js");

const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
};




//INDEX ROUTE
router.get("/", wrapAsync(listingControllers.index));

//NEW route
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

//SHOW ROUTE
router.get("/:id",wrapAsync(listingControllers.showListing));

// CREATE ROUTE
router.post("/",isLoggedIn,validateListing,wrapAsync(listingControllers.createListing));
  //EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));

//UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingControllers.updateListing));

//DELETE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing));



module.exports=router;