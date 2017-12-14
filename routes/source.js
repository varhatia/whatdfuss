var express = require("express");
var router = express.Router();
var Source = require("../models/source");
var User = require("../models/user");
var middleware = require("../middleware");


//12/13 : NOT done. Moving ON. Not sure how to model this 
router.get("/", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        //All sources
        Source.find({}, function(err, allSources){
            if(err){
                console.log(err);
            }
            console.log(currentUser.sources[0]);
            currentUser.sources[0] == "Future of AI";
            console.log(currentUser.sources[0]);
            console.log(allSources);
            console.log(allSources.indexOf(currentUser.sources[0]));
            if(allSources.indexOf(currentUser.sources[0]) > -1)
            {
                console.log("Present");
            }
        
            //retrive soucres for user
            // res.render("source", {user: currentUser});     
            res.render("source");     
        })
    })
});


router.post("/", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/feedRoute");
        } else {
            var sourceString = req.body;
            for (var key in req.body) {
                console.log("Key ", key);
                    if(err){
                        console.log(err);
                    }
                    else {
                        user.sources.push(key);
                    } 
            }
            user.save();
            res.redirect("/feedRoute");
        }
    });
});

module.exports = router;