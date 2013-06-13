var browserify = require("browserify"),
    path = require("path"),
    _ = require("underscore");

var componentFolder = path.normalize(__dirname + "../../../../content/components/");

var loadParam = function (configuration, file, folder) {
    var comp = _.find(configuration, function (comp) {
        return comp.name === file;
    });

    if (comp && comp.hasJs) {
        return folder + file + "/" + file + ".js";
    }

    return null;
};

module.exports = {
    build: function (params, instanceFolder, configuration, instanceConfiguration, cb) {
        var b = browserify();

        _.each(params, function (file) {
            var path = loadParam(configuration, file, componentFolder);
            if (path) {
                b.add(path);
            }
        });

        _.each(params, function (file) {
            var path = loadParam(instanceConfiguration, file, instanceFolder);
            if (path) {
                b.add(path);
            }
        });

        b.bundle(function (err, res) {
            cb(res);
        });
    }
};