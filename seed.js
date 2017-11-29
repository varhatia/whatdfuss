var mongoose = require("mongoose");
var Feed = require("./models/feed");

function seedDB(){
   Feed.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed feeds!");
    }); 
}

module.exports = seedDB;