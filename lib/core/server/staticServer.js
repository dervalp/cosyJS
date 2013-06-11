var fs = require("fs"),
    path = require("path"),
    _ = require("underscore");
/**
 * staticServer register the root in order to server all the component within a page
 */
module.exports = function(scriptBuilder) {
    var cache = {},
        templateCache = {},
        cosy;

    return {
        configure: function(app, instanceFolder, systemConfiguration, instanceConfiguration) {
            var systemConfiguration = systemConfiguration,
                instanceConfiguration = instanceConfiguration;

            app.get("/load/comp", function(req, res) {
                var param = req.query["mod"],
                    params = param.substring( 1, (param.length - 1) ).split(",");

                if(cache[param]) {
                    return res.send(cache[param]);
                } else {
                    scriptBuilder.build(params, instanceFolder, systemConfiguration, instanceConfiguration, function(file) {
                        cache[param] = file;
                        return res.send(file);
                    });
                }
            });

            app.get("/cosy/c.js", function(req, res) {
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

            app.get("/template/:id", function(req, res) {
                var compName = req.params.id;

                if(templateCache[compName]) {
                    return res.send(templateCache[compName]);
                }
                
                var path = process.cwd() + "/content/components/" + compName + "/" + compName + ".tmpl",
                    comp = _.find(systemConfiguration, function(comp) {
                        return comp.name === compName;
                    });

                if(!comp) {
                    path = instanceFolder + compName + "/" + compName + ".tmpl";
                    comp = _.find(instanceConfiguration, function(comp) {
                        return comp.name === compName;
                    });
                }

                if(!comp) {
                    throw compName + " not such a template";
                }


                fs.readFile(path, 'utf-8', function(err, content) {
                        if(!content) { throw "no content for " + compName; };
                        templateCache[compName] = content;
                        res.send(content);
                });
            });

        }
    };
};