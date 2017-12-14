var express = require("express");
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Feed = require("../models/feed");
var Source = require("../models/source");
var User = require("../models/user");
var middleware = require("../middleware");

//root route
router.get("/", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, currentUser){
        Feed.find({}, function(err, allFeeds){
            if(err){
                console.log(err);
            } else {
                Feed.count().exec(function(err, count) {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Count", count);
                        res.render("feeds/index",{feeds: allFeeds});
                    }
                })
            }
        });
    })
});

module.exports = router;