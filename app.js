const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");//grey means not used in this file now
const Review = require("./models/review.js");
const methodOverride = require('method-override')
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
// const schema=require("./schema.js");
// const listingSchema=schema.listingSchema
// {listingSchema} its same as schema.listingSchema

const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main() 
.then(()=>{
  console.log("connected to DB");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);

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

const sessionOptions={
  secret:"mysupersecretkey",
  resave:false,
  saveUninitialized:true,
  Cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};
app.use(session(sessionOptions));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",(req,res)=>{
  res.send("hi,i m root");
});

app.use((req,res,next)=>{
//  let msg =  req.flash("success"); ye tab agr render kr rahi hoti to use kr sakte the to send msg var to ejs but as using middleware and want tosend it to ejs then we can store it in res.locals
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currentUser=req.user;//req.user passport ka feature h jo logged in user ki info rkhtha h, res.locals m store krne se vo sb jagah access ho jata h ejs m
 
next();//next imp taki aage jaye or success ki value jo create listimg m define kri h vo le sake
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "delta-student2",
    
//   });
//   let registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
 
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// app.use("/users",);


app.use((err,req,res,next)=>{
  let {status=500,message="something went wrong"}=err;
  res.status(status).render("error.ejs",{err});
  // res.status(status).send(message);
  // res.send("something went wrong!!!");
  // next(err);
})

app.listen(8080,()=>{
  console.log(`server is listening at port 8080`);
})


// app.get("/testListing",async(req,res)=>{
//   let sampleListing =new Listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"calangute,goa",
//     country:"india"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("succesful");
// })
