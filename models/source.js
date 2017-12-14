var mongoose = require("mongoose");

var sourceSchema = new mongoose.Schema({
   name: String,
   url: String
});

module.exports = mongoose.model("Source", sourceSchema);