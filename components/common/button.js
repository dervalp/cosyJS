var _ = require("underscore"),
	tmpl = require("../../core/template/helper");

var template = "";

var Button = function(options) {
	this.text = options.text;
	this.isStatic = true;

	this.placeholder = options.placeholder;
	this.options = options;

	return this;
};

Button.prototype.render = function(cb) {
	var that = this;
	return tmpl.get("button", function(compiled){
		var res = compiled({ text: that.text });
		cb(res);
	});
};

module.exports = Button;