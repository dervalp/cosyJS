var fs = require('fs'),
    browserify = require("browserify"),
    _ = require('underscore'),
    async = require('async');

module.exports = function(componentFolder) {
    
    var extractFile = function(cb) {
        var param = this;
        cb(null, param);
    };

    /*async.map(params, function(param, callback) {
        var context = param;
        async.waterfall([extractFile.bind(context), readFile], function (err, result) {
            callback(undefined, result);
        });
    }, function(err, results) {
        cb(buildOutput(results));
    });*/

    var readFile = function(module, cb) {
        fs.readFile(componentFolder + module + ".js",'utf-8',function(err, content) {
            if (err) throw err;
            cb(null, content);
        });
    };

    var buildOutput = function(results) {
        var ouput = "";
        _.each(results, function(result){
            ouput += result;
        });

        return ouput;
    }

    return {
        build: function (params, cb) {
            var b = browserify();

            _.each(params, function(file){
                b.add(componentFolder + file + ".js");
            });

            b.bundle(function(err, res){
                cb(res);
            });
        }
    };
}