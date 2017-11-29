var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seed")
    
var feedRoute = require("./routes/feedRoute")

if(!process.env.DATABASEURL)
{   
    process.env.DATABASEURL = "mongodb://localhost/what_d_fuss_v1";
}

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.use("/", feedRoute);

app.listen(process.env.PORT || 3000 , function(){
    console.log("The WhatDFuss Server Has Started!");
})