var _ = require("underscore"),
	fs = require("fs"),
	async = require("async"),
	componentCache = { };

/**
 * @module
 * CTOR
 * param {Object} - { frameworkPath: {String}, instancePath: {String} }
 */
module.exports = function(path) {
	var COMP_PATH = path;

	var loadSingleComponent = function(name, cb) {
		var _c = this,
			path = COMP_PATH + name + ".js";
		console.log( "Loading " + name + " from path " + path );


		if(componentCache[name]) {
			eval(componentCache[name]);
			cb(null, _c);
		} else {
			fs.readFile(path, 'utf-8', function(err, content) {
				if(!content) { throw "no content for " + path; }

				componentCache[name] = content;
				//eval the content

				eval(content);

				cb(null, _c);
	    	});
		}
	};

	var loadMultipleComponents = function(components, _c , cb) {
		async.map(components, loadSingleComponent.bind(_c), function(err, result) {
			cb(result[0]);
		});
	};

	var loader = {
		load: function(name, _c, cb) {
			if(_.isArray(name)) {
				loadMultipleComponents(name, _c, cb);
			} else {
				loadSingleComponent.call(_c, name, function(err, result) {
					cb(result);
				});
			}
		}
	}

	return loader;
}