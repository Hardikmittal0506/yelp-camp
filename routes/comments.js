var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments - New
router.get("/new",middleware.isLoggedIn, (req, res) =>{
    Campground.findById(req.params.id, (err, campground) =>{
       if(err){
           console.log(err);
       } 
       else{
            res.render("./comments/new", {campground: campground});

       }
    });
});

//Comments - Create
router.post("/", middleware.isLoggedIn, (req, res) =>{
   Campground.findById(req.params.id, (err, campground) =>{
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } 
      else{
          Comment.create(req.body.comment, (err, comment) =>{
             if(err){
                 req.flash("error", "Something went wrong");
                 console.log(err);
             } 
             else{
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success", "Successfully Added Comment");
                 res.redirect("/campgrounds/" + campground._id);
             }
          });
      }
   }); 
});

//Edit Route

router.get("/:comment_id/edit", middleware.checkCommentsOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found");
            return res.redirect("/campgrounds");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            }
            else
            {
                res.render("./comments/edit", {campground_id: req.params.id, comment: foundComment}); 
    
            }
        });
    });
 
});

//Update Route
router.put("/:comment_id", middleware.checkCommentsOwnership, (req, res) =>{
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedCommnet) =>{
       if(err){
           res.redirect("back");
       }
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});

//delete Route
router.delete("/:comment_id", middleware.checkCommentsOwnership, (req, res) =>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
       if(err){
           res.redirect("back");
       } 
       else{
            req.flash("success", "Comment Deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



module.exports = router;