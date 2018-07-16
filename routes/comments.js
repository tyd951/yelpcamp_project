var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Something went wrong");
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});
//comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //associate comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect back to campgrounds page
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//comments edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");
        }
        else{
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                }else{
                    res.render("comments/edit",{campground_id:req.params.id ,comment:comment});
                }
            });
        }
    });

});

//comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        req.flash("success","Comment updated");
        res.redirect("/campgrounds/"+req.params.id);
    });
});

//comment delete
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        req.flash("success","Comment deleted");
        res.redirect("/campgrounds/"+req.params.id);
    });
})


module.exports = router;