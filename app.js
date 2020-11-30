
var express     =   require('express'), 
    app         =   express(),
    bodyParser  =   require('body-parser'),
    mongoose    =   require('mongoose'),
    campground  =   require('./models/campground')
    seedDB      =   require('./seeds'),
    Comment     =   require('./models/comment');

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
/*var campgrounds = [
    {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg"},
    {name: "Granite Hill", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg"},
    {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg"},
    {name: "Mount Sanhok ", image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg"},
    {name: "Mount Lizard", image: "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg"}
]*/

app.get("/", function(req, res){
    res.render("campgrounds/landing");
})

//INDEX route - Show all campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

//CREATE route - Add new campground to DB
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var img = req.body.imgurl;
    var desc = req.body.description;
    campground.create({
        name: name, 
        image:img,
        description: desc
    }, function(err, campground){
        if(err){
            console.log("ERROR!");
        } else{
            console.log("CAMPGROUND ADDED SUCCESSFULLY");
            res.redirect("campgrounds");
        }
    })
})

//NOTE: campgrounds/new must be before campground/:id. otherwise, it will treat campgrounds/new as id
//NOTE: to delete all the campgrounds in the database use db.campgrounds.drop()

//NEW route - Show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
})

//SHOW route - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("ERROR!")
        } else{
            //render show template with that campground 
            console.log(foundCampground)
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

// ===========================
// COMMENTS ROUTES
// ===========================
app.get("/campgrounds/:id/comments/new", function(req, res){
        campground.findById(req.params.id, function(err, campground){
            if(err){
                console.log(err)
            } else{
                res.render("comments/new", {campground: campground});
            }
        })
})

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err)
                } else {
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id)
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

app.listen(3000, function(){
    console.log("Server started at port 3000");
})