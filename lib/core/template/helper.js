/**
 * Template Engine for Server Side rendering
 */
module.exports = function (componentFolder) {
    var fs = require("fs"),
        path = require("path"),
        tmplSystem = require("handlebars");

    var SYSTEM_PATH = path.normalize(__dirname + "../../../../content/components/"),
        templateCache = {},
        INSERTION = "<{{element}} {{attributes}} cosy-type='{{type}}' cosy-id='{{id}}'></{{element}}>";

    tmplSystem.registerHelper("address", function (art, all) {
        if (art.city) {
            var url = "//" + art.city.shortName + "." + all.domain + "/";
            return new tmplSystem.SafeString("<a href='" + url + "'><span>" + art.city.name + "</span></a>");
        } else {
            return new tmplSystem.SafeString("<span>" + art.address + "</span>");
        }
    });

    tmplSystem.registerHelper("action", function () {

    });

    tmplSystem.registerHelper("css", function () {
        var className = "";
        if (this.fixed) {
            className += " c-fixed ";
            if (!this.orientation || this.orientation === "top") {
                className += "c-top";
            } else if (this.orientation === "bottom") {
                className += "c-bottom";
            }
        }
        return className;
    });

    tmplSystem.registerHelper("ranking", function (index) {
        return index + 1;
    });

    tmplSystem.registerHelper("placeholder", function (content) {
        if (!content) {
            return "";
        }
        return new tmplSystem.SafeString(content);
    });

    var get = function (name, isIntance, cb) {
        var template = templateCache[name];

        if (!template) {
            if (name === "insertion") {
                templateCache[name] = tmplSystem.compile(INSERTION);
                return cb(templateCache[name]);
            } else {
                var templatePath = path.normalize(SYSTEM_PATH + name + "/" + name + ".tmpl");

                if (isIntance) {
                    templatePath = path.normalize(componentFolder + name + "/" + name + ".tmpl");
                }

                console.log("fetching " + templatePath);
                fs.readFile(templatePath, "utf-8", function (err, content) {
                    if (!content) {
                        throw "no content for " + templatePath;
                    }

                    templateCache[name] = tmplSystem.compile(content);

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