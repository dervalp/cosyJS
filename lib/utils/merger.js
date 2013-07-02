var _ = require("underscore"),
	fs = require("fs"),
	path = require("path"),
	async = require("async");

var buildExtensions = function (components) {
	return _.reduce(components, function (memo, comp, index) {
		if (comp.type === "extend") {
			memo.push({
				index: index,
				comp: comp
			});
		}
		return memo;
	}, []);
};

var getJSONExtension = function (anchor, cb) {
	/*get the file and parse the json*/
	var fileExtension = path.normalize(this.pageFolder + "/" + anchor.comp.name + ".partial.json");

	fs.readFile(fileExtension, "utf-8", function (err, content) {
		cb(null, {
			index: anchor.index,
			object: JSON.parse(content)
		});
	});
};

module.exports = {
	extendPage: function (page, pageFolder, cb) {
		var extensions = buildExtensions(page.components),
			nbAdded = 0;

		if (extensions.length === 0) {
			return cb(page);
		}

		async.map(extensions, getJSONExtension.bind({
			pageFolder: pageFolder
		}), function (error, result) {

			_.each(extensions, function (extension) {
				var compsToAdd = _.find(result, function (ext) {
					return ext.index === extension.index;
				});

				var newIndex = extension.index + nbAdded;

				page.components.splice(newIndex, /*remove the extenstion point*/ 1, compsToAdd.object);

				page.components = _.flatten(page.components);

				nbAdded += (compsToAdd.object.length - 1);
			});

			return cb(page);
		});
	}
};