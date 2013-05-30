module.exports = function() {

	var fs = require("fs"),
		tmplSystem = require("handlebars"),
		conf = require("../../conf");

	tmplSystem.registerHelper('css', function() {
		var className = "";
  		if(this.fixed) {
  			className += " c-fixed ";
  			if(!this.orientation || this.orientation === "top") {
  				className += "c-top";
  			} else if(this.orientation === "bottom") {
  				className += "c-bottom";
  			}
  		}
  		return className;
	});

	var TMPL_PATH = conf.templatePath;

	var templateCache = {};

	var get = function (name, cb) {
		var template = templateCache[name];

		if(!template) {
			var path = TMPL_PATH + name + ".tmpl";
			console.log("fetching " + path);
			fs.readFile(path,'utf-8',function(err, content) {
				if(!content) { throw "no content for " + path; }

				templateCache[name] = tmplSystem.compile(content);

				return cb(templateCache[name]);
		    });
		} else {
			return cb(template);
		}
	};

	return {
		get: get
	}
};