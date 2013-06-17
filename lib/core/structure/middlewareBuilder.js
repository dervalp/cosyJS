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
        var all = [],
            middlewareCrawler = fileCrawler(SYSTEM_PATH),
            hasInstance = true;

        hasInstance = (SYSTEM_PATH === instanceFolder) ? false : hasInstance;

        middlewareCrawler.readFolder(SYSTEM_PATH, function (middlesSystem) {

            if (!hasInstance) {
                return middlewareCrawler.registerStructures(middlesSystem, register, callback);
            }

            return middlewareCrawler.readFolder(instanceFolder, function (middlesInstance) {
                all = all.concat(middlesSystem).concat(middlesInstance);
                middlewareCrawler.registerStructures(all, register, callback);
            });
        });
    }
};