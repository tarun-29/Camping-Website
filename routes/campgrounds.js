var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
//var middleware = require("../middleware");

//INDEX SHOW ALL CAMPGROUNDS
router.get('/', function(req, res){
    //get all campgrounds from data base
    Campground.find({},function(err, allCampgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
        res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});//in first v1 campground is used because we are taking data from the array that we created but now wa are taking data from our database so instead of campgrounds we will use AllCampgrounds
            
        }
    });
}); 

router.post('/',isLoggedIn,function(req, res){
var name = req.body.name;
var price = req.body.price
var image = req.body.image;
var author = {
    id:req.user._id,
    username: req.user.username
}
var desc = req.body.description;
var newCampground = {name:name, price:price, image: image, description:desc, author:author}
//create a new campground and save it to database
Campground.create(newCampground,function(err, newlycreated){
    if(err)
    {
        console.log(err);
    }
    else{
        res.redirect("/campgrounds");
    }
});
// campgrounds.push(newCampground);//we have no more array of campground so we will cmnt this our

// res.redirect('/campgrounds');
});

router.get('/new',isLoggedIn ,function(req, res){
    res.render("campgrounds/new.ejs");
});
//show more infor about campground
//remember this below route should be placed in right position otherwise if we put it above upper route than if we do campgrounds/new then that route will not be executed so remember
router.get("/:id",function(req, res){
//find the campground with provided id
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log(foundCampground);
        //render the show template with that background
        res.render("campgrounds/show",{campground:foundCampground });
    }
})
//render show template with that background

//res.render("show");

});
//Edit campground route
router.get('/:id/edit',checkCampgroundOwnership, function(req, res){
    //is user logged in
   
        Campground.findById(req.params.id, function(err, foundCampground){
           
            res.render("campgrounds/edit", {campground:foundCampground});                
 
 
});
});
//Update campground route

router.put('/:id',checkCampgroundOwnership, function(req,res){
    //find an update and correct campground

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
        {
            res.redirect('/campgrounds');
        }
        else
        {
            res.redirect("/campgrounds" + req.params.id)
        }
    })
    //redirect somewhere(show page)
})

//Destroy Campgrund route
router.delete('/:id',checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect('/campgrounds');
        }
    });
});

function checkCampgroundOwnership (req, res, next){
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err)
                {
                    req.flash("error", "Campground not Found")
                    res.redirect('back')
                }
                else
                {
                //does user own the campground
                //if(foundCampground===req.user.id)
                //this if statement cant be worked because the above comparison is in between mongoose object and the strings
                //so this is wrong so what can we do is something like this
                if(foundCampground.author.id.equals(req.user._id)){//this line meaning is that in the foundcampground bt id the author id is equals to the req.user.id if equals then rhis for loop will run
            
                next();
                }  
                else
                {
                    req.flash("error", "You Don't have permission to do that");
                    res.send("back");
                }
                }
            });
        }
        else
        {
            req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
    }
    }

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First"); 
    res.redirect('/login');
}

// 

module.exports = router;