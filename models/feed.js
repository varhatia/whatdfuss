var mongoose = require("mongoose");

var feedSchema = new mongoose.Schema({
   source: String,
   title: String,
   link: String,
   date: String
});

module.exports = mongoose.model("feed", feedSchema);