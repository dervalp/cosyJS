/* jshint evil: true */

var _ = require("underscore"),
    fs = require("fs"),
    path = require("path"),
    async = require("async"),
    parserHelper = require("../../utils/parsing"),
    componentCache = {},
    /**
     * Register javascript less component
     */
    defaultCode = function (type) {
        return "_c.component({ type: '" + type + "'});";
    },
    /**
     * Take a directory adn a list of file and create information for the component
     */
    createComponentConfiguration = function (directory, files) {
        var componentConfig = {};

        _.each(files, function (file) {
            var componentName,
                ext = path.extname(file);

            if (ext === ".js") {
                componentConfig.name = path.basename(file, ".js");
                componentConfig.jsPath = directory + "/" + file;
                componentConfig.hasJs = true;
            }
            if (ext === ".tmpl") {
                componentConfig.name = path.basename(file, ".tmpl");
                componentConfig.hasTmpl = true;
                componentConfig.tmplPath = directory + "/" + file;
            }
        });

        return componentConfig;
    },
    /**
     * Load a component and register it
     */
    loadSingleComponent = function (directory, cb) {
        var self = this,
            _c = this._c,
            isInstance = this.isInstance,
            conf = this.configuration;

        fs.readdir(directory, function (err, files) {
            var componentConfig = createComponentConfiguration(directory, files);

            conf.push(componentConfig);

            if (componentConfig.hasJs) {
                if (componentCache[componentConfig.name]) {
                    eval(componentCache[componentConfig.name]);
                    _c.components[componentConfig.name].isInstance = isInstance;
                    cb(null, self);
                } else {
                    fs.readFile(componentConfig.jsPath, "utf-8", function (err, content) {
                        if (!content) {
                            throw "no content for " + path;
                        }

                        console.log("Executing with a JS file " + componentConfig.name);
                        eval(content);

                        _c.components[componentConfig.name].isInstance = isInstance;
                        if (componentConfig.hasTmpl) {
                            fs.readFile(componentConfig.tmplPath, "utf-8", function (err, content) {
                                var type = parserHelper.extractType(content),
                                    placeholders = parserHelper.extractPlaceholders(content) || [];

                                _c.components[componentConfig.name].placeholders = placeholders;
                                cb(null, self);
                            });
                        } else {
                            cb(null, self);
                        }
                    });
                }
            } else if (!componentConfig.hasJs && componentConfig.hasTmpl) {
                fs.readFile(componentConfig.tmplPath, "utf-8", function (err, content) {
                    if (!content) {
                        throw "no content for " + path;
                    }

                    var type = parserHelper.extractType(content),
                        placeholders = parserHelper.extractPlaceholders(content) || [];

                    if (!componentCache[type]) {
                        console.log("Executing with a Tmpl file " + type);
                        eval(defaultCode(type));
                        _c.components[type].isInstance = isInstance;
                        _c.components[type].placeholders = placeholders;
                    }

                    cb(null, self);
                });
            } else {
                console.log("component does not have any js and any tmpl");
                console.log("Here is the directory parsed " + directory);
                cb(null, self);
            }
        });
    },
    /**
     * Load all the components and register them
     */
    loadMultipleComponents = function (components, _c, isInstance, cb) {
        var result = {
            configuration: [],
            _c: _c,
            isInstance: isInstance
        };
        async.map(components, loadSingleComponent.bind(result), function (err, result) {
            cb(result[0]);
        });
    },
    /**
     * Get all components from a base folder
     */
    getFolders = function (componentFolder, cb) {
        var comps = [];

        fs.readdir(componentFolder, function (err, files) {
            _.each(files, function (file) {
                var fullPath = componentFolder + file,
                    stats = fs.lstatSync(fullPath);
                if (stats.isDirectory()) {
                    comps.push(fullPath);
                }
            });
            cb(comps);
        });
    };

module.exports = {
    /**
     * Registering all the components (system and instance) in _c
     * @param {Object} - the cosy client Library
     * @param {String} - path to the Instance component folder (optionnal)
     * @param {Function} - callback
     */
    load: function (_c, componentFolder, isInstance, cb) {
        getFolders(componentFolder, function (comps) {
            if (comps.length === 0) {
                return cb(_c, {});
            }

            loadMultipleComponents(comps, _c, isInstance, function (compConf) {
                cb(compConf._c, compConf.configuration);
            });
        });
    }
};