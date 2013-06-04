/**
 * Template Engine for Server Side rendering
 */
module.exports = function(componentFolder) {
	var fs = require("fs"),
		path = require("path"),
		tmplSystem = require("handlebars");

	var SYSTEM_PATH = path.normalize(__dirname + "../../../../content/components/"),
		templateCache = {};
	
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

	var get = function (name, cb) {
		var template = templateCache[name];

		if(!template) {
			var templatePath = path.normalize(SYSTEM_PATH + name +"/" + name + ".tmpl");
			console.log("fetching " + templatePath);
			fs.readFile(templatePath,'utf-8',function(err, content) {
				if(!content) { throw "no content for " + templatePath; }

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