module.exports = function(componentFolder) {
	var loader = require("../components/loader")(componentFolder);

	return {
		build: function (components, _c, cb) {
			loader.load(components, _c, function(_c){
				cb(_c);
			});			
		}
	};
};