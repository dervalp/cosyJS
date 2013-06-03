var _           = require("underscore"),
    path        = require("path"),
    jade        = require("jade"),
    SYSTEM_PATH = path.normalize(__dirname + "../../../../content/layouts/"),
    fileCrawler = require("../../utils/fileCrawler"),
    systemCrawler = fileCrawler(SYSTEM_PATH),
    layoutCache = {};

var buildCacheAndCompileJade = function(path, cb) {
    fs.readFile(path,'utf-8', function(err, html) {
        if (err) throw err;

        var index = path.basename(path, ".jade");

        layoutCache[index] = {
            rawContent:     html
            template:       jade.compile(html, { filename: path, pretty: false })
        };

        cb(null, layoutCache);
    });
};

module.exports = {
    build: function (instancFolder, cb) {
        var instanceLayoutCrawler = fileCrawler(instancFolder);

        systemCrawler.readFolder(function(files) {
            systemCrawler.registerStructures(files, buildCacheAndCompileJade, function() {
                instanceLayoutCrawler.readFolder(function(files) {
                    instanceLayoutCrawler.registerStructures(files, buildCacheAndCompileJade, function() {
                        cb(layoutCache);
                    });
                });
            });
        });
    }
};.l