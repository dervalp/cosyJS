var _ = require('underscore');

module.exports = function() {
    var structures = {},
        SYSTEM_PATH = path.normalize(__dirname + "../../../../content/structures/");

    return {
        build: function (configuration, cb) {
            //load system structure
            //load instance structure
            
            cb();
        }
    };
}