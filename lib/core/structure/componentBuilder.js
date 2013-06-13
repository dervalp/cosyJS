var loader = require("../components/loader"),
	_ = require("underscore"),
	path = require("path"),
	SYSTEM_PATH = path.normalize(__dirname + "../../../../content/components/");

module.exports = {
	/**
	 * Registering all the components (system and instance) in _c
	 * @param {Object} - the cosy client Library
	 * @param {String} - path to the Instance component folder (optionnal)
	 * @param {Function} - callback
	 */
	build: function (_c, componentFolder, cb) {
		var callback = cb,
			hasInstanceComponent = true;

		if (_.isFunction(componentFolder)) {
			callback = componentFolder;
			hasInstanceComponent = false;
		}

		hasInstanceComponent = (SYSTEM_PATH === componentFolder) ? false : hasInstanceComponent;

		loader.load(_c, SYSTEM_PATH, false, function (_c, systemConfiguration) {
			if (hasInstanceComponent) {
				loader.load(_c, componentFolder, true, function (_c, instanceConfiguration) {

					return callback(_c, systemConfiguration, instanceConfiguration);
				});
			} else {
				return callback(_c, systemConfiguration, {});
			}
		});
	}
};