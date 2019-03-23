var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data =  [
    {
        name: "Cloud's rest" ,
        image: "https://cdn-az.allevents.in/banners/aa7f5e916abd9240beb3e654e97b4786",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Sunshine camp" ,
        image: "https://2.bp.blogspot.com/-Ue8lK68cgaI/V3la4qZyAeI/AAAAAAAABAA/_fzZxbUzn7wIeeiWu8AQqLDDNJTSUsm2wCLcB/s1600/tent-camping-ilaveezhaapoonchira.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Great camp" ,
        image: "http://www.lebanoninapicture.com/Prv/Images/Pages/Page_143342/camping-camp-weekend-adventure-clouds-sky-mount-10-16-2017-8-34-08-am-l.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]


function seedsDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err)
        {
            console.log(err);
        }
        console.log("remove campground!!");

           //add a new campground
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("added campground");
            }
            //create a comment
            Comment.create({text: "This place is great, but I wish there was a internet",
                            author: "Homer"
            }, function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("created new comment");
                }

            });
        })

    });
     });
 
}

module.exports = seedsDB;