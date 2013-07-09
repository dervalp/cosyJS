var fs = require("fs"),
    async = require("async"),
    path = require("path"),
    _ = require("underscore");

module.exports = function (systempath) {

    var pathToCrawl = systempath,
        results = [],
        readFolder = function (folder, cb) {
            var files = [];

            fs.readdir(folder, function (err, fileList) {
                _.each(fileList, function (file) {
                    files.push(folder + file);
                });
                cb(files);
            });
        },
        parseJson = function (path, cb) {
            fs.readFile(path, "utf-8", function (err, content) {
                if (!content) {
                    throw "no content for " + path;
                }
                if (path.indexOf(".partial.json") === -1) {
                    results.push(JSON.parse(content));

                }
                cb(null, results);
            });
        },
        registerStructures = function (all, visit, cb) {
            async.map(all, visit, function (err, result) {
                cb(result[0]);
            });
        },
        build = function (instanceFolder, visit, cb) {
            //load system structure
            //load instance structure
            var all = [],
                folders = [],
                visitor = visit,
                callback = cb,
                hasInstance = true;

            if (_.isFunction(instanceFolder) && !cb) {
                visitor = instanceFolder;
                callback = visit;
                hasInstance = false;
            } else {
                if (!_.isArray(instanceFolder)) {
                    hasInstance = (pathToCrawl === instanceFolder) ? false : hasInstance;
                    folders.push(instanceFolder);
                } else {
                    folders = instanceFolder;
                }
            }

            readFolder(pathToCrawl, function (structures) {

                if (!hasInstance) {
                    return registerStructures(structures, visitor, callback);
                }
                async.map(folders, function (folder, partialCb) {
                    readFolder(folder, function (instanceStructures) {
                        all = all.concat(structures).concat(instanceStructures);
                        registerStructures(all, visitor, function (structures) {
                            partialCb(null, structures);
                        });
                    });
                }, function (err, result) {
                    return callback(all);
                });
            });
        };


    var requireFile = function (crawl, cb) {
        results[path.basename(crawl, ".js")] = require(crawl);
        cb(null, results);
    };

    return {
        readFolder: readFolder,
        parseJson: parseJson,
        requireFile: requireFile,
        build: build,
        registerStructures: registerStructures
    };
};