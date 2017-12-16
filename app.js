var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    seed      = require("./seed");
    
var feedRoute = require("./routes/feed"),
    sourceRoute = require("./routes/source"),
    indexRoute = require("./routes/index")

console.log("Database URL" ,process.env.DATABASEURL);
if(!process.env.DATABASEURL)
{   
    process.env.DATABASEURL = "mongodb://localhost/what_d_fuss_v1";
}


//Note: set NODE_TLS_REJECT_UNAUTHORIZED=0 in windows to gt rid of "Error: self signed certificate in certificate chain"
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seed.seedDB();
seed.parseBecomingAI();
seed.parseAITrends();
seed.parseFutureOfLife();
seed.parseNews18();
seed.parseTechCrunchML();
seed.parseExtremeTechML();
seed.parseNews18ML();
seed.parseTechCrunchIOT();
seed.parseExtremeTechIOT();
seed.parseNews18IOT();
seed.parseNetworkWorldIOT();
seed.parseTechCrunchCloud();
seed.parseNews18Cloud();
seed.parseExtremeTechCloud();
seed.parseNetworkWorldCloud();
seed.retriveRecurringFeed();


//Passport Configuration
app.use(require("express-session")({
    secret: "What is favourite color?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoute);
app.use("/sourceRoute", sourceRoute);
app.use("/feedRoute", feedRoute);


app.listen(process.env.PORT || 3000 , function(){
    console.log("The WhatDFuss Server Has Started!");
})