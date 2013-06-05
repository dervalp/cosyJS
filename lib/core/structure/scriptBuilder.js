var browserify  = require("browserify"),
    path        = require("path"),
    _           = require('underscore');

var componentFolder = path.normalize(__dirname + "../../../../content/components/");

module.exports = return {
        build: function (params, configuration, cb) {
            var b = browserify();

            _.each(params, function(file) {
                var comp = _.find(configuration, function(comp) {
                    return comp.name === file;
                });

                if(comp.hasJs) {
                    b.add(componentFolder + file + "/" + file + ".js");
                }
            });

            b.bundle(function(err, res) {
                cb(res);
            });
        }
    };