const express= require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
// const _ = require("lodash");
const mongoose = require("mongoose");


const app= express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/wikiDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true});

const articleSchema = {
    name: String,
    content: String
};

const Article= mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function(req,res){
        Article.find(function(err,foundArticles){
            if(!err){
                res.send(foundArticles);
            }
            else{
                res.send(err);
            }
        });
    })

    .post(function(req,res){
        const newArticle = new Article({
            name: req.body.name,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("sucssfully added a new article");
            }
            else{
                res.send(err);
            }
        });
    })

    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted all the articles");
            }
            else{
                res.send(err);
            }
        });
    });


app.route("/articles/:articleName")
    .get(function(req,res){
        Article.findOne({name:req.params.articleName},function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("Article Not Found");
            }
        });
    })
    .post(function(req,res){
        Article.update({name:req.params.articleName},{
            name: req.body.name,
            content: req.body.content
        },
        {
            overwrite:true
        }, function(err){
            if(!err){
                res.send("successfully updated");
            }
        });
    })
    .patch(function(req,res){
        Article.update({name:req.params.articleName},
            {
                $set: req.body
            },function(err){
                if(!err){
                    res.send("successfully updated(patched)");
                }
            });
    })
    .delete(function(req,res){
            Article.deleteOne({name:req.params.articleName}, function(err){
                if(!err){
                    res.send("deleted ");
                }
                else{
                    res.send(err);
                }
            });
        });

app.listen(3000, function(){
    console.log("server started at port 3000");
});