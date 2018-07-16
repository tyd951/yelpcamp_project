var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
//requiring routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");
    
//seed database
//seedDB();

//mongoose.connect("mongodb://localhost/yelp_camp_final");
//export DATABASEURL=mongodb://localhost/yelp_camp_final
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_final";
mongoose.connect(url);

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"try harder",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var port = process.env.PORT || 8080;

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(port,function(){
    console.log("Yelpcamp Server has started");
});
