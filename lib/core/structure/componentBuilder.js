var loader = require("../components/loader");

module.exports = function(componentFolder) {
	var componentFolder = componentFolder;
	return {
		build: function (_c, cb) {
			loader.load(_c, componentFolder, function(_c){
				cb(_c);
			});			
		}
	};
};