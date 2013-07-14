var _ = require("underscore"),
    treeHelper = require("../../utils/tree"),
    tmplSystem = require("handlebars"),
    async = require("async");


var renderArea = function (placeholder, components, areaRendered) {
    var pls = [],
        index = 0,
        indexedArea = [],
        buildIndex = function (component) {
            if (component.model.get("placeholder") === placeholder) {
                indexedArea.push({
                    index: index,
                    component: component
                });
                index++;
            }
        },
        subPlaceHolder = function (a) {
            if (a.component.model.get("hasPlaceholder")) {
                pls.push({
                    index: a.index,
                    component: a.component
                });
            }
        };

    _.each(components, buildIndex);

    _.each(indexedArea, subPlaceHolder);

    async.map(pls, function (area, subPlaceholderRendered) {
        var areaBeingRendered = area;

        areaBeingRendered.component.view.render(function (subPlaceholderHtml, partialJson) {

            var htmlToInsert = {},
                subPlaceTemplate = subPlaceholderHtml,
                placeholders = area.component.model.get("placeholders");


            async.map(placeholders, function (subPlaceholder, childRendered) {
                var fullName = area.component.model.get("id") + "." + subPlaceholder;

                renderArea(fullName, components, function (resultObj) {

                    htmlToInsert[subPlaceholder] = {
                        html: resultObj.html,
                        json: resultObj.json
                    };

                    childRendered(undefined, resultObj);
                });
            }, function (err) {
                var json = [],
                    htmlObj = {},
                    currentArea = _.find(indexedArea, function (a) {
                        return a.index === areaBeingRendered.index;
                    });

                json.push(partialJson);

                for (var area in htmlToInsert) {
                    if (htmlToInsert.hasOwnProperty(area)) {
                        htmlObj[area] = htmlToInsert[area].html;
                        json.push(htmlToInsert[area].json);
                    }
                }

                var data = _.extend(htmlObj, areaBeingRendered.component.model.toJSON());

                currentArea.content = {
                    html: subPlaceTemplate(data),
                    json: json
                };

                subPlaceholderRendered(null, {
                    html: "html",
                    json: json
                });
            });
        });
    }, function (err) {
        async.map(indexedArea, function (area, callback) {
            if (!area.content) {
                return area.component.view.render(function (compHTML, compJson) {
                    callback(null, {
                        html: compHTML,
                        json: compJson
                    });
                });
            } else {
                return callback(null, {
                    html: area.content.html,
                    json: area.content.json
                });
            }
        }, function (err, result) {

            var json = [];
            var html = _.reduce(result, function (memo, obj) {

                json = json.concat(obj.json);
                return memo + obj.html;
            }, "");

            areaRendered({
                html: html,
                json: json
            });
        });
    });
};

var hasPlaceholder = function (placeholders) {
    return placeholders && _.keys(placeholders).length > 0;
};

var buildControlsTree = function (components, placeholders, cb) {
    if (hasPlaceholder(placeholders)) {
        var pls = treeHelper.flatten(placeholders),
            objectForTemplate = {};

        async.map(pls, function (placeholder, cb) {
            renderArea(placeholder, components, function (area) {
                objectForTemplate[placeholder] = area;
                cb(undefined, area);
            });
        }, function (err, result) {
            cb(objectForTemplate);
        });
    } else {
        renderArea("content", components, function (area) {
            cb(area);
        });
    }
};

var buildControl = function (component) {

    var initialdata = _.extend(_.omit(component, ["data"]), component.data),
        control = this._c.expose(component, initialdata);

    this.components.push(control);
    this.module[component.id] = control.model;
};

/**
 * CTOR: create a new Page Object
 * @params {Object} - config is an object which has the parameters to create a Grid
 *                    {
 *                      grid: {Object}, //only grid is required
 *                      layout: {String} //layout is required
 *                    }
 * @params {Array} - array of Controls, should come from a database
 * @returns {Object}
 */
var Page = function (_c, grid, layout, componentsConfig, placeholder, controllers, scope) {
    //require
    this._c = _c;
    this.grid = grid;
    this.layout = layout;
    //optionals
    this.placeholder = placeholder || {};
    this.componentsConfig = componentsConfig || [];
    this.components = [];
    this.componentPlacholders = [];
    this.module = {};
    this.controllers = controllers || [];
    this.scope = scope || {};
    //initialization
    this.buildControls();
};

Page.prototype.initialized = function (req, done) {
    var module = this.module;

    if (this.controllers.length === 0) {
        return done();
    }

    async.map(this.controllers, function (controller, cb) {
        controller.call(module, req, function (controllerDone) {
            cb(null, controllerDone);
        });
    }, function () {
        done();
    });
};

Page.prototype.buildControls = function () {
    _.each(this.componentsConfig, buildControl, this);
};

Page.prototype.getServerComponents = function () {
    return _.filter(this.components, function (component) {
        return !component.model.get("onlydynamic");
    });
};

Page.prototype.getFrontEndComponents = function () {
    return _.filter(this.components, function (component) {
        return component.model.get("dynamic") || component.model.get("onlydynamic");
    });
};

Page.prototype.buildScript = function () {
    var scripts = this.layout.scripts || [];
    return JSON.stringify(scripts);
};

Page.prototype.render = function (cb) {
    var self = this,
        content, pageTemplate,
        serverSideComponents = self.getServerComponents(),
        scriptConfiguration = self.buildScript();

    content = self.grid.create(self.placeholder);

    buildControlsTree(serverSideComponents, self.placeholder, function (areas) {

        var json = [],
            stringiJSON,
            htmlObj = {};

        for (var area in areas) {
            if (areas.hasOwnProperty(area)) {
                htmlObj[area] = areas[area].html;
                json = json.concat(areas[area].json);
            }
        }

        json = _.flatten(json);

        var all = _.extend(self.scope, {
            type: "__all",
            id: "__all"
        });

        json.push(all);

        stringiJSON = JSON.stringify(json);

        pageTemplate = tmplSystem.compile(self.layout.template)({
            content: content,
            conf: stringiJSON,
            scripts: scriptConfiguration
        });

        cb(tmplSystem.compile(pageTemplate)(htmlObj));
    });
};

module.exports = Page;