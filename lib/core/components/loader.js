var _ = require("underscore"),
	fs = require("fs"),
	async = require("async"),
    parserHelper = require("../../utils/parsing"),
	componentCache = { };

/**
 * @module
 * CTOR
 * param {Object} - { frameworkPath: {String}, instancePath: {String} }
 */
module.exports = function() {
  
    var defaultCode = function(type) {
        return "_c.component({ type: '" + type + "'});"
    };

    var createComponentConfiguration = function (files) {
        var componentConfig = {};

        _.each(files, function(file){
            var componentName,
                ext = path.extname(file);

            if(ext === ".js") {
                componentConfig.name = path.basename(file, '.js');
                componentConfig.jsPath = file;
                componentConfig.hasJs = true;
            }
            if(ext === ".tmpl") {
                componentConfig.hasTmpl = true;
            }
        });

        return componentConfig;
    }

	var loadSingleComponent = function(directory, cb) {
		var _c = this,

        fs.readdir(directory, function (err, files) {
            var componentConfig = createComponentConfiguration(files);

            if(componentConfig.hasJs) {
                if(componentCache[componentConfig.name]) {
                    eval(componentCache[name]);
                    cb(null, _c);
                } else {
                    fs.readFile(componentConfig.jsPath, 'utf-8', function(err, content) {
                        if(!content) { throw "no content for " + path; }

                        componentCache[name] = content;
                        //eval the content

                        eval(content);

                        cb(null, _c);
                    });
                }
            } else if(!componentConfig.hasJs && componentConfig.hasTmpl) {
                fs.readFile(componentConfig.jsPath, 'utf-8', function(err, content) {
                    if(!content) { throw "no content for " + path; }

                    var type = parserHelper.extractType(content);

                    if(!componentCache[typeName]) {
                        eval(defaultCode(type));
                    }

                    cb(null, _c);
                });
            } else {
                console.log("component does not have any js and any tmpl");
                console.log("Here is the directory parsed " + directory);
                cb(null, _c)
            }
        });
	};

	var loadMultipleComponents = function(components, _c , cb) {
		async.map(components, loadSingleComponent.bind(_c), function(err, result) {
			cb(result[0]);
		});
	};

	var getFolders = function(componentFolder, cb) {
		var comps = [];
		fs.readdir(componentFolder, function (err, files) {
	  		 _.each(files, function(file){
	  		 	stats = fs.lstatSync(file);
	  		 	if (stats.isDirectory()) {
    				comps.push(file);
				}
	  		 });
	  		 cb(comps);
		});
	};

	var loader = {
		load: function(_c, componentFolder, cb) {
			getFolders(function(comps) {
				loadMultipleComponents(comps, _c, cb);
			});
		}
	}

	return loader;
}
