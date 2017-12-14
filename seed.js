var mongoose = require("mongoose");
var Feed = require("./models/feed");
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Feed = require("./models/feed");
var Source = require("./models/source");
var User = require("./models/user");
var date = require('date-and-time');

var options = {
    headers: {'user-agent': 'node.js'}
}

function parseBecomingAIImpl(){
    request("https://becominghuman.ai/latest", options, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        else{
            var $ = cheerio.load(body);
        
            $('div.js-postListHandle > div.u-paddingTop20').each(function( index ) {
                var link = $(this).find('div.postArticle-content > a').attr('href');
                var title = $(this).find('div.section-inner > h3').text().trim();
                var time = $(this).find('time').text().trim();
                // console.log("Link: " + link);
                // console.log("Title: " + title);
                // console.log("Time: " + time); //Dec 12

                dateTime = time.split(" ");
                // console.log(dateTime[1].length);
                if(dateTime[1].length < 2)
                {
                    dateTime[1] = "0" + dateTime[1]; 
                    // console.log(dateTime[1].length);
                    time = dateTime[0] + " " + dateTime[1];
                    // console.log(time);
                }
                var datemod = date.parse(time, 'MMM DD');
                var nwdate = date.format(datemod, 'MMMM DD');
                // console.log(nwdate);
                        
                var newFeedRecord = {source: "Becoming Human", title: title, link: link, date: nwdate}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
}

function parseAITrendsImpl(){
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
                var time = $(this).find('div.td-module-meta-info > span.td-post-date').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //August 29, 2017
                
                dateTime = time.split(",");
                nwdate = dateTime[0];
                // console.log(nwdate);
                
                var newFeedRecord = {source: "AI Trends", title: title, link: link, date: nwdate}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }   
    });
}

function parseFutureOfLifeImpl(){
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
                var title = $(this).find('div.slide-content > header.entry-content-header > h3.slide-entry-title > a').attr('title');
                var time = $(this).find('div.slide-meta > time').attr('datetime');
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //2017-08-17T10:46:19+00:00
                
                dateTime = time.split("T");
                // console.log(dateTime[0]);
                var datemod = date.parse(dateTime[0], 'YYYY-MM-DD');
                var nwdate = date.format(datemod, 'MMMM DD'); 
                console.log(nwdate);
    
                var newFeedRecord = {source: "Future of Life", title: title, link: link, date: nwdate}
                
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNews18Impl(){
    request("http://www.news18.com/newstopics/artificial-intelligence/news/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.search-listing > ul > li').each(function( index ) {
                var link = $(this).find('h2 > a').attr('href');
                var title = $(this).find('h2 > a').text().trim();
                var time = $(this).find('span.post-date').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "News 18", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function hackerNews(){
    request("http://www.news18.com/newstopics/artificial-intelligence/news/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.search-listing > ul > li').each(function( index ) {
                var $ = cheerio.load(body);
                $('tr.athing:has(td.votelinks)').each(function( index ) {
                    var title = $(this).find('td.title > a').text().trim();
                    var link = $(this).find('td.title > a').attr('href');
                    fs.appendFileSync('hackernews.txt', title + '\n' + link + '\n');
                });
                Feed.create(newFeedRecord, function(err, newlyFetched){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
}

module.exports = {
    seedDB: function (){
        Feed.remove({}, function(err){
             if(err){
                 console.log(err);
             }
             console.log("removed feeds!");
        }); 
     },
    parseBecomingAI: function (){
        parseBecomingAIImpl();
    },           
    parseAITrends: function (){
        parseAITrendsImpl();
    },
    parseFutureOfLife: function(){
        parseFutureOfLifeImpl();
    },
    parseNews18: function(){
        parseNews18Impl();
    },
    retriveRecurringFeed: function (){
        var interval = setInterval(function() {
            console.log("Retrieving after hour");
            parseBecomingAIImpl();
            parseAITrendsImpl();
            parseFutureOfLifeImpl();
            parseNews18Impl();
        }, 360000);
    }
}