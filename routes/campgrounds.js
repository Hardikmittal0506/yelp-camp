var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//NEW Route
router.get("/new", middleware.isLoggedIn, (req, res) =>{
   res.render("./campgrounds/new"); 
});


//Index Route
router.get("/", (req, res) =>{
    
    Campground.find({}, (err, allCampgrounds) => {
       if(err){
         console.log(err);  
       } 
       else{
           res.render("./campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

//Create Route
router.post("/", middleware.isLoggedIn, (req, res) =>{
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        user: req.user.username
    }
    var newCampground = {
        name : name,
        price: price,
        image: image,
        description: description,
        author: author
    };
    Campground.create(
    newCampground, (err,campground) =>{
       if(err){
           console.log("Error");
       } 
       else{
            res.redirect("/campgrounds");
       }
    });
});

//Show Route
router.get("/:id", (req, res) =>{
   Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
      if(err || !foundCampground) {
         req.flash("err", "Campground Not Found"); 
         res.redirect("/campgrounds");     
      }
      else
      {
       res.render("./campgrounds/show", {campground: foundCampground}); 
      }
   });
   
});

//Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
       if(err || !foundCampground){
        req.flash("error", "Campground not found");
        res.redirect("/campgorunds");     
       }else
       {
              res.render("./campgrounds/edit", {campground: foundCampground}); 
        }
    });        
});
//Update Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
     if(err){
         res.redirect("/campgrounds");
     }  
     else{
         res.redirect("/campgrounds/" + req.params.id);
     }
   });
});

//Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership,  (req, res) =>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
       if(err){
           res.redirect("/campgrounds");
       } 
       else{
           res.redirect("/campgrounds");
       }
    });
    
});

module.exports = router;
