// Dependencies
// =============================================================
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");


// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {
        // First, we grab the body of the html with request
        axios.get("https://politics.theonion.com/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            var resultArr = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $(".postlist__item").each(function(i, element) {
                // Save an empty result object
                var result = {};

                // Add the headline, summary, and href of every article, and save them as properties of the result object
                result.headline = $(this)
                    .find("h1.headline")
                    .text();
                result.summary = $(this)
                    .find("div.entry-summary")
                    .children("p")
                    .text();
                result.link = $(this)
                    .find("h1.headline")
                    .children("a")
                    .attr("href");

                if (result.headline == "" || result.summary == "" || result.link == "") { //validation for empty properties
                    console.log("Article skipped due to empty headline, summary, or link");
                } else {
                    resultArr.push(result); //push to array of results if headline, summary, and link are provided
                }

            });

            // Create a new Article using the `result` object built from scraping
            db.Article
                .create(resultArr)
                .then(function(dbArticle) {
                    // If we were able to successfully scrape and save an the articles, render page with all articles
                    console.log("Web Scrape Complete With No Errors!");
                    //after the new entries are entered into the database, render all into index.html
                    db.Article
                        .find({})
                        // ..and populate all of the comments associated with it
                        .populate("comments")
                        .then(function(dbArticle) {
                            // render results into handelbars view
                            res.render("index", { articles: dbArticle });
                        })
                        .catch(function(err) {
                            // If an error occurred, send it to the client
                            console.log(err);
                        });

                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    console.log(err);
                    db.Article
                        .find({})
                        // ..and populate all of the comments associated with it
                        .populate("comments")
                        .then(function(dbArticle) {
                            // render results into handelbars view
                            res.render("index", { articles: dbArticle });
                        })
                        .catch(function(err) {
                            // If an error occurred, send it to the client
                            console.log(err);
                        });
                });


        });

    });

    app.post("/comment", function(req, res) {

        var comment = req.body.body;
        var articleID = req.body.articleId;

        var newComment = {
            body: comment,
            _article: articleID
        };

        db.Comment
            .create(newComment)
            .then(function(dbComment) {

                db.Article.findOneAndUpdate({_id: articleID}, {$push: {comments: dbComment._id}});

                res.send(true);

            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                console.log(err);
                res.send(false);
            });
    });

};