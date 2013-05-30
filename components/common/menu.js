var _ = require("underscore"),
	tmpl = require("../../core/template/helper");

var template = "";

var Menu = function(options) {
	this.items = options.items;
	this.isStatic = true;

	this.placeholder = options.placeholder;
	this.options = options;

	return this;
};

Menu.prototype.render = function(cb) {
	var that = this;
	return tmpl.get("menu", function(compiled){
		var res = compiled({ items: that.items });
		cb(res);
	});
};

module.exports = Menu;