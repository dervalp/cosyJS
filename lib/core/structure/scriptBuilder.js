var browserify = require("browserify"),
    _ = require('underscore');

module.exports = function() {
    return {
        build: function (params, configuration, cb) {
            var b = browserify();

            _.each(params, function(file) {
                var comp = _.find(configuration, function(comp) {
                    return comp.name === file;
                });

                if(comp.hasJs) {
                    b.add(componentFolder + file + ".js");
                }
            });

            b.bundle(function(err, res) {
                cb(res);
            });
        }
    };
}