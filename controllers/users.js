const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
  res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
 try{ let {username,email,password}=req.body;
  let newUser=new User({
    email,
    username,
  })
  let registeredUser=await User.register(newUser,password);
  console.log(registeredUser); 

  //req.login main work is to add userto session or say req.user
  req.login(registeredUser,(err)=>{//taki jisne signup kiya vo automatically login ho jaye 
    if(err){
      return next(err);
    } 
  req.flash("success","Welcome to Wanderlust!");
  res.redirect("/listings")});
}catch(e){
  req.flash("error", e.message);
  res.redirect("/signup");
}
}
module.exports.renderLoginForm=(req,res)=>{
  res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
  req.flash("success","Welcome back to Wanderlust!");
  res.redirect(res.locals.redirectUrl || "/listings");
}
module.exports.logout=(req,res,next)=>{
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("success","Logged you out!");
    res.redirect("/listings");
  });
}