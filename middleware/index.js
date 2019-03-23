var Campground = require('../models/campground');
var Comment = require('../models/comment');
//aal the middleware are here
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err)
                {
                    res.redirect('back')
                }
                else
                {
                //does user own the campground
                //if(foundCampground===req.user.id)
                //this if statement cant be worked because the above comparison is in between mongoose object and the strings
                //so this is wrong so what can we do is something like this
                if(foundCampground.author.id.equals(res.user._id)){//this line meaning is that in the foundcampground bt id the author id is equals to the req.user.id if equals then rhis for loop will run
            
                next();
                }  
                else
                {
                    res.send("back");
                }
                }
            });
        }
        else
        {
           res.redirect("back");
    }
    }

middlewareObj.checkCommentOwnership = function (req, res, next){
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
                res.send("back");
            }
            }
        });
    }
    else
    {
       res.redirect("back");
}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}




module.export = middlewareObj;