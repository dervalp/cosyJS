var _ = require("underscore"),
	fs = require("fs"),
    path = require("path"),
	async = require("async"),
    parserHelper = require("../../utils/parsing"),
	componentCache = { },
    defaultCode = function(type) {
        return "_c.component({ type: '" + type + "'});"
    };

    var createComponentConfiguration = function (directory, files) {
        var componentConfig = {};

        _.each(files, function(file) {
            var componentName,
                ext = path.extname(file);

            if(ext === ".js") {
                componentConfig.name = path.basename(file, '.js');
                componentConfig.jsPath = directory + "\\" + file;
                componentConfig.hasJs = true;
            }
            if(ext === ".tmpl") {
                componentConfig.name = path.basename(file, '.tmpl');
                componentConfig.hasTmpl = true;
                componentConfig.tmplPath = directory + "\\" + file; 
            }
        });

        return componentConfig;
    }

	var loadSingleComponent = function(directory, cb) {
		var _c = this;

        fs.readdir(directory, function (err, files) {
            var componentConfig = createComponentConfiguration(directory, files);

            if(componentConfig.hasJs) {
                if(componentCache[componentConfig.name]) {
                    eval(componentCache[componentConfig.name]);
                    cb(null, _c);
                } else {
                    fs.readFile(componentConfig.jsPath, 'utf-8', function(err, content) {
                        if(!content) { throw "no content for " + path; }

                        componentCache[componentConfig.name] = content;
                        //eval the content

                        eval(content);

                        cb(null, _c);
                    });
                }
            } else if(!componentConfig.hasJs && componentConfig.hasTmpl) {
                fs.readFile(componentConfig.tmplPath, 'utf-8', function(err, content) {
                    if(!content) { throw "no content for " + path; }

                    var type = parserHelper.extractType(content);

                    if(!componentCache[type]) {
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
	  		 _.each(files, function(file) {
                var fullPath = componentFolder + "\\" + file,
                    stats = fs.lstatSync(fullPath);
	  		 	if (stats.isDirectory()) {
    				comps.push(fullPath);
				}
	  		 });
	  		 cb(comps);
		});
	};

	module.exports  = {
		load: function(_c, componentFolder, cb) {
			getFolders(componentFolder, function(comps) {
				loadMultipleComponents(comps, _c, cb);
			});
		}
	}
