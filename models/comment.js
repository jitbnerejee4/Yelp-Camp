var mongoose = require('mongoose');

commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

var comment = mongoose.model("comment", commentSchema);
module.exports = comment;