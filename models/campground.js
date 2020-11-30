var mongoose = require('mongoose');
//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment" //name of the comment model
        }
    ]
});
var campground = mongoose.model("campground", campgroundSchema);
module.exports = campground;