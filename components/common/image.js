var DOMBuilder = require("../../core/structure/DOMBuilder"),
	_ = require("underscore"),
	CONTENT = "<%=source%>";

var buildTemplate = function(type, options) {
	return DOMBuilder.img(CONTENT, options);
};

var Image = function(options) {
	this.source = options.source;
	this.isStatic = true;

	this.placeholder = options.placeholder;
	this.options = options;

	return this;
};

Image.prototype.template = function() {
	return _.template(buildTemplate(this.source, this.options));
};

Image.prototype.render = function(cb) {
	var template = this.template();
	var res =  template({ source: this.source });
	cb(res);
};

module.exports = Image;