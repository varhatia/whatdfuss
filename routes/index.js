var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.redirect("/feedRoute")
});

//show login form
router.get("/register", function(req, res){
    res.render("register"); 
 });
 
 //handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        console.log("In rgister");
        if(err){
            // req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("Authentiatied");
            //TODO: initialize intial choice
            res.redirect("/feedRoute"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/feedRoute",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
//    req.flash("success", "Logged you out!");
   res.redirect("/feedRoute");
});

//handling about us
router.get("/AboutUs", function(req, res){
    req.logout();
 //    req.flash("success", "Logged you out!");
    res.redirect("/feedRoute");
 });
 
module.exports = router;