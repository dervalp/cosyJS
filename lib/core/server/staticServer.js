var fs = require("fs"),
    path = require("path");
/**
 * staticServer register the root in order to server all the component within a page
 */
module.exports = function(scriptBuilder) {
    var cache = {}, cosy;

    return {
        configure: function(app, configuration) {
            var configuration = configuration;

            app.get("/load/comp", function(req, res) {
                var param = req.query["mod"],
                    params = param.substring( 1, (param.length - 1) ).split(",");

                if(cache[param]) {
                    return res.send(cache[param]);
                } else {
                    scriptBuilder.build(params, configuration, function(file) {
                        cache[param] = file;
                        return res.send(file);
                    });
                }
            });

            app.get("/c.js", function(req, res) {
                var cosyPath = path.normalize(__dirname + "/../../../clientLib/c.js")

                if(!cosy) {
                    fs.readFile(cosyPath, 'utf-8', function(err, content) {
                        if(!content) { throw "no content for cosy.js"; }
                        cosy = content;
                        res.send(content);
                    });
                } else {
                    res.send(cosy);
                }
            });
        }
    };
};