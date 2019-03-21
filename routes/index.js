var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//Root Route
router.get("/", (req, res) =>{
   res.render("landing");
});

//Register Form
router.get("/register", (req, res)=>{
   res.render("register"); 
});

//Sign Up Logic
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
       if(err){
           req.flash("error", err.message);
           console.log(err);
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, ()=>{
           req.flash("success", "Welcome to YelpCamp "+ req.body.username);
           res.redirect("/campgrounds");
       });
    });
});

//Login Form
router.get("/login", (req, res)=>{
    res.render("login");
});

//Login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=>{
});


//Logout Route
router.get("/logout", (req, res)=>{
   req.logout();
   req.flash("success", "Logged you Out!");
   res.redirect("/campgrounds");
});

module.exports = router;