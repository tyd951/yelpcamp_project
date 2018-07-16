var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//index - campground
router.get("/",function(req,res){
    //get all campgrounds from db
    Campground.find({},function(err,allCampgroundS){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgroundS});
        }
    })
    // res.render("campgrounds",{campgrounds:campgrounds});
});

//new - create the object
router.post("/",middleware.isLoggedIn,function(req,res){
    // get data from form, add to campground array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name:name,
        price:price,
        image:image,
        description:desc,
        author:author
    };
    Campground.create(newCampground,function(err,campground){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        } else {
            // redirect back to campgrounds page
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

//create - to the form
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//show - shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirec("back");
        }else{
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    //is user logged in?
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

//update
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        req.flash("success","Campground updated");
        res.redirect("/campgrounds/"+req.params.id);
    });
});


//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        req.flash("success","Campground deleted");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
