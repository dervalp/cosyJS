var loader 		= require("../components/loader"),
	_ 			= require("underscore"),
	path 		= require("path")
	SYSTEM_PATH = path.normalize(__dirname + "../../../../content/components/");

module.exports = function() {
	return {
		build: function (_c, componentFolder, cb) {
			var callback = cb,
				hasInstanceComponent = true;

			if(_.isFunction(componentFolder)) {
				callback = componentFolder;
				hasInstanceComponent = false;
			}

			loader.load(_c, SYSTEM_PATH, function(_c, systemConfiguration) {
				if(hasInstanceComponent) {
					loader.load(_c, componentFolder, function(_c, instanceConfiguration) {
						callback(_c, systemConfiguration, instanceConfiguration);
					});
				} else {
					callback(_c, systemConfiguration, {});
				}
			});
		}
	};
};