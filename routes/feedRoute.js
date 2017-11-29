var express = require("express");
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Feed = require("../models/feed");

var options = {
    headers: {'user-agent': 'node.js'}
}

function parseBecomingAI(){
    request("https://becominghuman.ai/latest", options, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        else{
            var $ = cheerio.load(body);
        
            $('div.js-postListHandle > div.u-paddingTop20').each(function( index ) {
                var link = $(this).find('div.postArticle-content > a').attr('href');
                var title = $(this).find('div.section-inner > h3').text().trim();
                var date = $(this).find('time').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + date);

                var newFeedRecord = {source: "Becoming Human", title: title, link: link, date: date}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
}

function parseAITrends(){
    request("https://aitrends.com/category/features/", options, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
            
            var $ = cheerio.load(body);
        
            $('div.td-ss-main-content > div.td_module_wrap').each(function( index ) {
                var link = $(this).find('h3 > a').attr('href');
                var title = $(this).find('h3 > a').text().trim();
                var date = $(this).find('div.td-module-meta-info > span.td-post-date').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + date);
            
                var newFeedRecord = {source: "AI Trends", title: title, link: link, date: date}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }   
    });
}

function parseFutureOfLife(){
    request("https://futureoflife.org/ai-news/", options, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
            
            var $ = cheerio.load(body);
        
            $('div.avia-content-slider-inner > div.slide-entry-wrap').each(function( index ) {
                var link = $(this).find('article.post-entry > a').attr('href');
                var date = $(this).find('div.slide-meta > time').attr('datetime');
                console.log("Title: " + link);
                console.log("Time: " + date);
            
                var newFeedRecord = {source: "Future of Life", title: "Dummy", link: link, date: date}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
}

//root route
router.get("/", function(req, res){
    parseBecomingAI();
    parseAITrends();
    parseFutureOfLife();
    
    // request(sourceArray[0], options, function(error, response, body) {
    //     if(error) {
    //       console.log("Error: " + error);
    //     }
        
    //     console.log("Status code: " + response.statusCode);
        
        
    //     var $ = cheerio.load(body);
      
    //     // $('div.td-ss-main-content > div.td_module_wrap').each(function( index ) {
    //     //     var link = $(this).find('h3 > a').attr('href');
    //     //     var title = $(this).find('h3 > a').text().trim();
    //     //     var date = $(this).find('div.td-module-meta-info > span.td-post-date').text().trim();
    //     //     console.log("Link: " + link);
    //     //     console.log("Title: " + title);
    //     //     console.log("Time: " + date);
        
        
    //     $('div.js-postListHandle > div.u-paddingTop20').each(function( index ) {
    //         var link = $(this).find('div.postArticle-content > a').attr('href');
    //         var title = $(this).find('div.section-inner > h3').text().trim();
    //         var date = $(this).find('time').text().trim();
    //         console.log("Link: " + link);
    //         console.log("Title: " + title);
    //         console.log("Time: " + date);

    //         var newFeedRecord = {source: "https://aitrends.com/category/features/", title: title, link: link, date: date}
            
    //         Feed.create(newFeedRecord, function(err, newlyFetched){
    //             if(err){
    //                 console.log(err);
    //             } 
    //         });
    //     });
    // });
    
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
                    // console.log("Got all feeds", allFeeds);
                }
            })
        }
    });
});

module.exports = router;