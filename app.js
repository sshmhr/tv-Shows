var request = require("request");
var express = require("express");
var bodyParser=require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({extended:true}));

        app.get("/",function(req,res){
            res.render("form.ejs");            
        });
        app.post("/torrent",function(req,res){
            var show = req.body.search;
            
            request("https://tv-v2.api-fetch.website/shows/1?sort=name&order=1&keywords="+show.show,function(error,response,body){
            if(!error && response.statusCode===200){
            // body always returns a string in order to convert the string to a json object we use JSON.parse()
            var parsedBody = JSON.parse(body);
            // console.log(parsedBody[0].imdb_id);
            res.redirect("/torrent/"+parsedBody[0].imdb_id+"/"+show.season+"/"+show.episode);
        }
    });
            
        })

       app.get("/torrent/:id/:season/:episode",function(req,res){
        request("https://tv-v2.api-fetch.website/show/"+req.params.id,function(error,response,body){
        if(!error && response.statusCode===200){
            // body always returns a string in order to convert the string to a json object we use JSON.parse()
            var parsedBody = JSON.parse(body);
            // res.redirect(parsedBody["episodes"]["0"].torrents["0"].url);
            for(var i =0;i<parsedBody["episodes"].length;i++){
                if((parsedBody["episodes"][""+i].episode==req.params.episode)&&(parsedBody["episodes"][""+i].season==req.params.season)){
                    res.redirect(parsedBody["episodes"][""+i].torrents["0"].url)
                }
            }
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});