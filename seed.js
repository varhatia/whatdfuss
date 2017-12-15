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
            console.log("Status code: " + response.statusCode);
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
                        
                var newFeedRecord = {source: "Becoming Human", type: "ai", title: title, link: link, date: nwdate}
                
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
                
                var newFeedRecord = {source: "AI Trends", type: "ai", title: title, link: link, date: nwdate}
                
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
    
                var newFeedRecord = {source: "Future of Life", type: "ai", title: title, link: link, date: nwdate}
                
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
                var category = $(this).find('span.post-date > a ').text().trim();
                if(category != "Tech")
                {
                    return;
                }
                
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "News 18", type: "ai", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

//All ML
function parseTechCrunchMLImpl(){
    request("https://techcrunch.com/tag/machine-learning/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.l-main > ul.river > li.river-block').each(function( index ) {
                var link = $(this).find('div.block > div.block-content > h2 > a').attr('href');
                var title = $(this).find('div.block > div.block-content > h2 > a').text().trim();
                if(!link)
                {
                    link = $(this).find('div.block > div.block-content-brief > h2 > a').attr('href');
                    title = $(this).find('div.block > div.block-content-brief > h2 > a').text().trim();
                }
                if(!link)
                {
                    link = $(this).find('div.block > div.block-featured-content > div.block-content > h2 > a').attr('href');
                    title = $(this).find('div.block > div.block-featured-content > div.block-content > h2 > a').text().trim();
                }

                var title = $(this).find('div.block > div.block-content > h2 > a').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                // datetime logic

                dateTime = link.split("/");
                time = dateTime[3]+"-"+dateTime[4]+"-"+dateTime[5];
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                var datemod = date.parse(time, 'YYYY-MM-DD');
                var nwdate = date.format(datemod, 'MMMM DD');
                
                console.log(nwdate);
               
                var newFeedRecord = {source: "Techcrunch", type: "ml", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseExtremeTechMLImpl(){
    request("https://www.extremetech.com/tag/machine-learning", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('section.story-river > ul > li').each(function( index ) {
                var link = $(this).find('div.deck > h4 > a').attr('href');
                var title = $(this).find('div.deck > h4 > a').text().trim();
                var time = $(this).find('div.deck > h4 > span').text().trim();
                console.log("Link: " + link);
                if(!link)
                {
                    return;
                }
                console.log("Title: " + title);
                console.log("Time: " + time);
                // datetime logic

                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);

                var newFeedRecord = {source: "ExtremeTech", type: "ml", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNews18MLImpl(){
    request("http://www.news18.com/newstopics/machine-learning/news/", function(error, response, body) {
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
                var category = $(this).find('span.post-date > a ').text().trim();
                if(category != "Tech")
                {
                    return;
                }
                
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "News 18", type: "ml", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

//All IOT
function parseTechCrunchIOTImpl(){
    request("https://techcrunch.com/tag/iot/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.l-main > ul.river > li.river-block').each(function( index ) {
                var link = $(this).find('div.block > div.block-content > h2 > a').attr('href');
                if(!link)
                {
                    link = $(this).find('div.block > div.block-content-brief > h2 > a').attr('href');
                }
                if(!link)
                {
                    link = $(this).find('div.block > div.block-featured-content > div.block-content > h2 > a').attr('href');
                }

                var title = $(this).find('div.block > div.block-content > h2 > a').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                // datetime logic

                dateTime = link.split("/");
                time = dateTime[3]+"-"+dateTime[4]+"-"+dateTime[5];
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                var datemod = date.parse(time, 'YYYY-MM-DD');
                var nwdate = date.format(datemod, 'MMMM DD');
                console.log(nwdate);
               
                var newFeedRecord = {source: "Techcrunch", type: "iot", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseExtremeTechIOTImpl(){
    request("https://www.extremetech.com/tag/internet-of-things", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('section.story-river > ul > li').each(function( index ) {
                var link = $(this).find('div.deck > h4 > a').attr('href');
                var title = $(this).find('div.deck > h4 > a').text().trim();
                var time = $(this).find('div.deck > h4 > span').text().trim();
                console.log("Link: " + link);
                if(!link)
                {
                    return;
                }
                console.log("Title: " + title);
                console.log("Time: " + time);
                // datetime logic

                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);

                var newFeedRecord = {source: "ExtremeTech", type: "iot", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNews18IOTImpl(){
    request("http://www.news18.com/newstopics/iot/news/", function(error, response, body) {
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
                var category = $(this).find('span.post-date > a ').text().trim();
                if(category != "Tech")
                {
                    return;
                }console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "News 18", type: "iot", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNetworkWorldIOTImpl(){
    request("https://www.networkworld.com/category/internet-of-things/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.stories > div.article').each(function( index ) {
                var link = $(this).find('div.promo-headline > h3 > a').attr('href');
                var title = $(this).find('div.promo-headline > h3 > a').text().trim();
                var time = $(this).find('div.byline').text().trim();
                console.log("Link: " + "https://www.networkworld.com"+link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                //Date logic
                dateTime = time.split("|");
                var datemod = dateTime[1].trim();
                dateActual = datemod.split(",");
                nwdate = dateActual[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "NetworkWorld", type: "iot", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

//All Cloud
function parseTechCrunchCloudImpl(){
    request("https://techcrunch.com/cloud-2/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.l-main > ul.river > li.river-block').each(function( index ) {
                var link = $(this).find('div.block > div.block-content > h2 > a').attr('href');
                if(!link)
                {
                    link = $(this).find('div.block > div.block-content-brief > h2 > a').attr('href');
                }
                if(!link)
                {
                    link = $(this).find('div.block > div.block-featured-content > div.block-content > h2 > a').attr('href');
                }

                var title = $(this).find('div.block > div.block-content > h2 > a').text().trim();
                console.log("Link: " + link);
                console.log("Title: " + title);
                // datetime logic

                dateTime = link.split("/");
                time = dateTime[3]+"-"+dateTime[4]+"-"+dateTime[5];
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                var datemod = date.parse(time, 'YYYY-MM-DD');
                var nwdate = date.format(datemod, 'MMMM DD');
                console.log(nwdate);
               
                var newFeedRecord = {source: "Techcrunch", type: "cloud", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNews18CloudImpl(){
    request("http://www.news18.com/newstopics/cloud/news/", function(error, response, body) {
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
                var category = $(this).find('span.post-date > a ').text().trim();
                if(category != "Tech")
                {
                    return;
                }
                console.log("Link: " + link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "News 18", type: "cloud", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseExtremeTechCloudImpl(){
    request("https://www.extremetech.com/category/computing", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('section.story-river > ul > li').each(function( index ) {
                var link = $(this).find('div.deck > h4 > a').attr('href');
                var title = $(this).find('div.deck > h4 > a').text().trim();
                var time = $(this).find('div.deck > h4 > span').text().trim();
                console.log("Link: " + link);
                if(!link)
                {
                    return;
                }
                console.log("Title: " + title);
                console.log("Time: " + time);
                // datetime logic

                dateTime = time.split(",");
                nwdate = dateTime[0];
                console.log(nwdate);

                var newFeedRecord = {source: "ExtremeTech", type: "cloud", title: title, link: link, date: nwdate}
                Feed.create(newFeedRecord, function(err, newlyFetched){
                if(err){
                    console.log(err);
                    } 
                });
            });
        }
    });
}

function parseNetworkWorldCloudImpl(){
    request("https://www.networkworld.com/category/cloud-computing/", function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        }
        else
        {
            console.log("Status code: " + response.statusCode);
           
            var $ = cheerio.load(body);
      
            $('div.stories > div.article').each(function( index ) {
                var link = $(this).find('div.promo-headline > h3 > a').attr('href');
                var title = $(this).find('div.promo-headline > h3 > a').text().trim();
                var time = $(this).find('div.byline').text().trim();
                console.log("Link: " + "https://www.networkworld.com"+link);
                console.log("Title: " + title);
                console.log("Time: " + time); //November 20, 2017, 12:01 pmexplore: Auto
    
                //Date logic
                dateTime = time.split("|");
                var datemod = dateTime[1].trim();
                dateActual = datemod.split(",");
                nwdate = dateActual[0];
                console.log(nwdate);
               
                var newFeedRecord = {source: "NetworkWorld", type: "cloud", title: title, link: link, date: nwdate}
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
    
    //ALL ML
    parseTechCrunchML: function(){
        parseTechCrunchMLImpl();
    },
    parseExtremeTechML: function(){
        parseExtremeTechMLImpl();
    },
    parseNews18ML: function(){
        parseNews18MLImpl();
    },
    
    //All IOT
    parseTechCrunchIOT: function(){
        parseTechCrunchIOTImpl();
    },
    parseExtremeTechIOT: function(){
        parseExtremeTechIOTImpl();
    },
    parseNews18IOT: function(){
        parseNews18IOTImpl();
    },
    parseNetworkWorldIOT: function(){
        parseNetworkWorldIOTImpl();
    },
    
    //All Cloud
    parseTechCrunchCloud: function(){
        parseTechCrunchCloudImpl();
    },
    parseNews18Cloud: function(){
        parseNews18CloudImpl();
    },
    parseExtremeTechCloud: function(){
        parseExtremeTechCloudImpl();
    },
    parseNetworkWorldCloud: function(){
        parseNetworkWorldCloudImpl();
    },

    retriveRecurringFeed: function (){
        var interval = setInterval(function() {
            console.log("Retrieving after hour");
            parseBecomingAIImpl();
            parseAITrendsImpl();
            parseFutureOfLifeImpl();
            parseNews18Impl();
            parseExtremeTechMLImpl();
            parseTechCrunchMLImpl();
            parseTechCrunchIOTImpl();
            parseExtremeTechIOTImpl();
            parseNews18IOTImpl();
            parseNetworkWorldIOTImpl();
            parseTechCrunchCloudImpl();
            parseExtremeTechCloudImpl();
            parseNews18CloudImpl();
            parseNetworkWorldCloudImpl();
        }, 360000);
    }
}