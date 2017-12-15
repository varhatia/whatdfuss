var mongoose = require("mongoose");

var feedSchema = new mongoose.Schema({
   source: String,
   type: String,
   title: String,
   link: String,
   date: String
});

module.exports = mongoose.model("Feed", feedSchema);