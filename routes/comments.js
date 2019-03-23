var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//var middleware = require("../middleware");



//===============================
// COMMENT ROUTE
//===============================

router.get('/new',isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id,function(err, campground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground:campground});
        }
    })
    //res.render("comments/new")
});
//Comment create 
router.post('/',isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                {   
                    req.flash("error", "Something Went Wrong!!");
                    console.log(err);
                }
                else
                {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    });
    //create new comment
    //create new comment to campground
    //redirect campground new page
});
//Comment Edit Route
router.get("/:comment_id/edit",checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    })

})

//Commetn Update
router.put("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});

//comment destroy 
router.delete("/:comment_id",checkCommentOwnership, function(req, res){
    //findById and Remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment Deleted Successfully")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

function checkCommentOwnership (req, res, next){
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err)
            {
                res.redirect('back')
            }
            else
            {
            //does user own the comment
            //if(foundCampground===req.user.id)
            //this if statement cant be worked because the above comparison is in between mongoose object and the strings
            //so this is wrong so what can we do is something like this
            if(foundComment.author.id.equals(res.user._id)){//this line meaning is that in the foundcampground bt id the author id is equals to the req.user.id if equals then rhis for loop will run
        
            next();
            }  
            else
            {   
                req.flash("error", "You don't have permission to do that");
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


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect('/login');
}

module.exports = router;