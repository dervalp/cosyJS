var fs = require("fs"),
    path = require("path");

module.exports = function (componentFolder) {

    var SYSTEM_PATH = path.normalize(__dirname + "../../../../content/components/"),
        templateCache = {},
        INSERTION = "<{{element}} {{attributes}} cosy-type='{{type}}' cosy-id='{{id}}'></{{element}}>";

    var get = function (name, isIntance, cb) {
        var template = templateCache[name];

        if (!template) {
            if (name === "insertion") {
                return cb(INSERTION);
            } else {
                var templatePath = path.normalize(SYSTEM_PATH + name + "/" + name + ".tmpl");

                if (isIntance) {
                    templatePath = path.normalize(componentFolder + name + "/" + name + ".tmpl");
                }

                fs.readFile(templatePath, "utf-8", function (err, content) {
                    if (!content) {
                        throw "no content for " + templatePath;
                    }

                    templateCache[name] = content;

                    return cb(templateCache[name]);
                });
            }
        } else {
            return cb(template);
        }
    };

    return {
        get: get
    };
};