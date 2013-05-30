var DOMBuilder = require("../../core/structure/DOMBuilder"),
	_ = require("underscore"),
	CONTENT = "<%=text%>";

var texts = {
	p: 		DOMBuilder.p,
	h1: 	DOMBuilder.title(1),
 	h2: 	DOMBuilder.title(2),
    h3: 	DOMBuilder.title(3),
	h4: 	DOMBuilder.title(4),
	h5: 	DOMBuilder.title(5),
	h6: 	DOMBuilder.title(6)
};

var buildTemplate = function(category, options) {
	return texts[category](CONTENT, options);
};

var Text = function(options) {
	this.category = options.category;
	this.text = options.data.text;
	this.dynamic = options.dynamic || false;
	console.log("#CTOR TEXT");

	this.placeholder = options.placeholder;
	this.options = options;

	return this;
};

Text.prototype.template = function() {
	return _.template(buildTemplate(this.category, this.options));
};

Text.prototype.render = function(cb) {
	var template = this.template();
	
	var result =  template({ text: this.text });
	cb(result);
};


module.exports = Text;