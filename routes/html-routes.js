// Dependencies
// =============================================================
var db = require("../models");


// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {
        // First, we grab the body of the html with request
        axios.get("https://politics.theonion.com/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $(".postlist__item").each(function(i, element) {
                // Save an empty result object
                var result = {};

                // Add the headline, summary, and href of every link, and save them as properties of the result object
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
                    .attr("href")

                // Create a new Article using the `result` object built from scraping
                db.Article
                    .create(result)
                    .then(function(dbArticle) {
                        // If we were able to successfully scrape and save an Article, send a message to the client
                        res.send("Article Scrape Complete");
                    })
                    .catch(function(err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });
            });
        });
    });

};