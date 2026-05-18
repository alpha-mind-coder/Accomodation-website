// import Listing from "../models/listing.js";
const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
 let allListings=await Listing.find({});
 res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs");}

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
       req.flash("error","Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    
    res.render("./listings/show.ejs",{listing})
  }

module.exports.createListing=async (req,res,next)=>{
  // SHORT-WAY
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
  // let result= listingSchema.validate(req.body);
  // console.log(result);
  // if(result.error){
  //   throw new ExpressError(400,result.error);
  // }
  // make a different middleware
    const newListing = new Listing(req.body.listing)
  newListing.owner=req.user._id;
  // let {title,description,image,price,country,location}=req.body;
  // let newListing=new Listing({
  //   title:title,
  //   description:description,
  //   image:image,
  //   price:price,
  //   country:country,
  //   location:location
  // })
  await newListing.save();
  req.flash("success","New Listing Created!");//defination of flash here
  res.redirect("/listings");

}

module.exports.renderEditForm=async(req,res)=>{
   let {id} = req.params;
  const listing= await Listing.findById(id);
  if(!listing){
     req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}
module.exports.updateListing=async(req,res)=>{
   
   let {id}=req.params;
    // let listing=await Listing.findById(id)
    // if(  !listing.owner.equals(res.locals.currentUser._id)){
    //   req.flash("error" , "You do not have the permission to edit this listing");
    //   //return very important as if not written the next part of if will also run
    //   return res.redirect(`/listings/${id}`);
    //  }
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated");
   res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);//whenever thsi is called then the post middleware in listing.js file is also called and delte the reviews that were preset in that listing from review collection too
   req.flash("success","Listing Deleted");
   res.redirect("/listings");
}