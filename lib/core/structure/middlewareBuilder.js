var fileCrawler = require("../../utils/fileCrawler"),
	path = require("path"),
	SYSTEM_PATH = path.normalize(__dirname + "../../../../content/middlewares/"),
	results = {};

var register = function (crawl, cb) {
	results[path.basename(crawl, ".js")] = require(crawl);
	cb(null, results);
};

module.exports = {
	build: function (instanceFolder, callback) {
		var middlewareCrawler = fileCrawler(SYSTEM_PATH); //no system for controller

		middlewareCrawler.build(instanceFolder, register, function () {
			callback(results);
		});
	}
};