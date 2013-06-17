var fileCrawler = require("../../utils/fileCrawler"),
    results = {},
    path = require("path");

var register = function () {
    results[path.basename(crawl, ".js")] = require(crawl);
    cb(null, results);
};

module.exports = {
    build: function (controllerFolder, callback) {
        var controllerCrwaller = fileCrawler(""); //no system for controller

        controllerCrwaller.readFolder(controllerFolder, function (controllersInstance) {
            controllerCrwaller.registerStructures(controllersInstance, register, callback);
        });
    }
};