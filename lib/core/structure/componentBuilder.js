module.exports = function(conf) {
	var conf = conf,
		loader = require("../components/loader")(conf.componentFolder);

	return {
		build: function (components, _c, cb) {
			loader.load(components, _c, function(_c){
				cb(_c);
			});			
		}
	};
};