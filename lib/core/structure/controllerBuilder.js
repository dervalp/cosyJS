var fileCrawler = require("../../utils/fileCrawler"),
    results = {},
    path = require("path");

var register = function (crawl, cb) {
    results[path.basename(crawl, ".js")] = require(crawl);
    cb(null);
};

module.exports = {
    build: function (controllerFolder, callback) {
        var controllerCrwaller = fileCrawler(""); //no system for controller
        controllerCrwaller.build(controllerFolder, register, function () {
            callback(results);
        });
    }
};