var _           = require("underscore"),
    path        = require("path"),
    fs          = require("fs"),
    jade        = require("jade"),
    SYSTEM_PATH = path.normalize(__dirname + "../../../../content/layouts/"),
    fileCrawler = require("../../utils/fileCrawler"),
    systemCrawler = fileCrawler(SYSTEM_PATH),
    layoutCache = {};

var buildCacheAndCompileJade = function(pathToLayout, cb) {
    fs.readFile(pathToLayout,'utf-8', function(err, html) {
        if (err) throw err;

        var index = path.basename(pathToLayout, ".jade");

        layoutCache[index] = {
            rawContent:     html,
            template:       jade.compile(html, { filename: pathToLayout, pretty: false })
        };

        cb(null, layoutCache);
    });
};

module.exports = {
    build: function (instancFolder, cb) {
        var callback = cb,
            hasInstance = true;

        if(_.isFunction(instancFolder)) {
            callback = instancFolder;
            hasInstance = false;
        }


        systemCrawler.readFolder(SYSTEM_PATH, function(files) {
            systemCrawler.registerStructures(files, buildCacheAndCompileJade, function() {
                if(hasInstance) {
                    var instanceLayoutCrawler = fileCrawler(instancFolder);

                    instanceLayoutCrawler.readFolder(instancFolder, function(files) {
                        instanceLayoutCrawler.registerStructures(files, buildCacheAndCompileJade, function() {
                            callback(layoutCache);
                        });
                    });
                } else {
                    callback(layoutCache);
                }
            });
        });
    }
};