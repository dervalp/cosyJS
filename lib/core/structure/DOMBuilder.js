var DIV = "<div {{id}} {{class}}>{{content}}</div>",
	CLASS = "class='{{class}}'",
	ID = "id='{{id}}'",
	CLOSINGTAG = ">";

var classBuilder = function (cl) {
	if (!cl || cl === "") {
		return "";
	}
	return CLASS.replace("{{class}}", cl);
};

var idBuilder = function (id) {
	if (!id || id === "") {
		return "";
	}
	return ID.replace("{{id}}", id);
};

var cosyAttr = function (opts, type) {
	if (!type) {
		throw "no type has been defined";
	}

	if (opts && opts.dynamic) {
		return "cosy-id='" + opts.id + "' cosy-type='" + opts.type + "'";
	} else {
		return "";
	}
};

var dataText = " data-text=model.text ";

var htmlBuilder = {
	div: function (cl, id, content) {
		var classContent = classBuilder(cl),
			idContent = idBuilder(id);

		content = content || "";

		return DIV.replace("{{id}}", idContent).replace("{{class}}", classContent).replace("{{content}}", content);
	},
	title: function (weight) {
		return function (content, options) {
			var start = "<h" + weight + " ",
				end = "</h" + weight + ">",
				attrs,
				bindings = "";

			content = content || "";
			options = options || {};
			attrs = cosyAttr(options, "text");

			if (options.dynamic) {
				bindings += " " + dataText;
			}

			return start + attrs + bindings + CLOSINGTAG + content + end;
		};
	},
	p: function (content, options) {
		var start = "<p ",
			end = "</p>",
			attrs,
			bindings = "";

		options = options || {};
		attrs = cosyAttr(options, "text");
		content = content || "";

		if (options.dynamic) {
			bindings += " " + dataText;
		}

		return start + attrs + bindings + CLOSINGTAG + content + end;
	},
	img: function (content, options) {
		var start = "<img ",
			end = "/>",
			attrs;

		options = options || {},
		attrs = cosyAttr(options, "img");
		content = content || "";

		return start + attrs + " " + "src='" + content + "'" + end;
	}
};

module.exports = htmlBuilder;