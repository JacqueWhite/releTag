var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/article")

// A GET request to scrape the website
var scrape = function(cb) {
    // First, we grab the body of the html with request
    request("http://www.bbc.com/news", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);

            var bbcScrape = [];

            $("div.gs-c-promo-body").each(function(i, element) {
                    var bbcRoot = "http://www.bbc.com";

                    // Add the text and href of every link, and save them as properties of the result object - var result.title = $(element).children().text(); OR
                    var title = $(this).find("h3").text();
                    // // var result.link = $(element).children().attr("href"); OR
                    var link = $(this).find("a").attr("href");
                    if (link.slice(0, 4) != "http") {
                        link = "http://www.bbc.com" + link
                    }

                    var summary = $(this).find("p.gs-c-promo-summary").text();

                    var date = $(this).find("time").attr("datetime");

                    var source = "BBC";

                    var category = $(this).find("a.gs-c-section-link").text();

                    var catLink = bbcRoot + $(this).find("a.gs-c-section-link").attr("href");

                    var dataToAdd = {
                        title: title,
                        link: link,
                        summary: summary,
                        date: date,
                        source: source,
                        category: category,
                        catLink: catLink
                    };
                bbcScrape.push(dataToAdd);
                }); 
            cb(bbcScrape);
            }); 
};

module.exports = scrape;