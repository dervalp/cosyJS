module.exports = function(componentFolder) {
	var loader = require("../components/loader")(componentFolder);

	return {
		build: function (_c, componentFolder, cb) {
			loader.load(_c,, componentFolder function(_c){
				cb(_c);
			});			
		}
	};
};