var Backbone = require("backbone"),
    rivets = require("rivets"),
    tmplSystem = require("handlebars"),
    _ = require("underscore");

(function () {
    "use strict";

    var root = this,
        _cosy = this._c,
        _c,
        modules = {};

    tmplSystem.registerHelper("placeholder", function (content) {
        if (!content) { return ""; }
        return new tmplSystem.SafeString(content);
    });

    var isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
        Backbone.$ = function () {
            return {
                attr: function () {},
                off: function () {},
                on: function () {}
            }
        };

        Backbone.$.get = function () {};
    }

    if (typeof exports !== 'undefined') {
        _c = exports;
    } else {
        _c = root._c = {};
    }

    if (isBrowser) window._c = _c;

    _c.isBrowser = isBrowser;

    _c.VERSION = "0.1.0";

    _c.tmplSystem = tmplSystem;

    _c.async = _.async || {};

    function only_once(fn) {
        var called = false;
        return function () {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    _c.async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _.each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                } else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };

    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_c.async.each].concat(args));
        };
    };

    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _.map(arr, function (x, i) {
            return {
                index: i,
                value: x
            };
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };

    _c.async.map = doParallel(_asyncMap);

    var extractComp = function (str) {
            var componentRegex = new RegExp(/\{\{component(.*?)\}\}/g),
                matches,
                result = [];

            while (matches = componentRegex.exec(str)) {
                result.push(matches[1].replace(/^\s+|\s+$/g, ""));
            }

            return result;
        },
        templateEngine = function () {
            var cache = {};

            return {
                get: function (path, isInstance, cb) {
                    var template = cache[path];
                    if (!template) {
                        Backbone.$.get("/cosy/template/" + path, function (data) {
                            cache[path] = data;

                            return cb(data);
                        });
                    } else {
                        return cb(data);
                    }
                }
            };
        };

    _c.templateEngine = templateEngine();

    _c.setEngine = function (tmplEngine) {
        _c.templateEngine = tmplEngine;
    };

    _c.define = function (name, content) {
        var module;

        if (!content) {
            content = name;
            module = modules["main"];
        } else {
            module = modules[name]
        }

        if (_.isFunction(content)) {
            return content.call(module, Backbone, _);
        }
        if (_.isObject(content)) {
            module = _.extend(module, content);
            module.initialize(Backbone, _);
        };
    };
    /**
     * Rivets adapters
     */
    if (isBrowser) {
        rivets.configure({
            adapter: {
                subscribe: function (obj, keypath, callback) {
                    callback.wrapped = function (m, v) {
                        callback(v)
                    };
                    if (keypath) {
                        obj.on('change:' + keypath, callback.wrapped);
                    }
                },
                unsubscribe: function (obj, keypath, callback) {
                    obj.off('change:' + keypath, callback.wrapped);
                },
                read: function (obj, keypath) {
                    return obj.get(keypath);
                },
                publish: function (obj, keypath, value) {
                    obj.set(keypath, value);
                }
            }
        });

        rivets.config.handler = function (context, ev, bindings) {
            var key = bindings.key,
                keypath = bindings.keypath,
                models = bindings.view.models;

            if (key === "model") {
                return models.model[keypath].call(models.model, ev);
            } else if (key === "view") {
                return models.view[keypath].call(models.view, ev);
            } else if (key === "module") {
                return models.view.module[keypath].call(models.view.module, ev);
            } else {
                throw "no handler found";
            }
        };
    }


    /**
     * Static Definitions
     */
    var ComponentModel = _c.Model = Backbone.Model;

    var ComponentView = _c.View = Backbone.View.extend({
        initialize: function (options) {
            options = options || {};
            this.template = options.template || undefined;
            this.module = options.module;
            this._cInit();
        },
        _cInit: function () {},
        render: function (callback) {
            var html,
                toClient = [],
                self = this;

            var template = this.template || this.model.get("type") || undefined;

            if( this.model.get("dynamic") ) {
                toClient.push(self.model.toJSON());
            }

            var render = function (tmplContent, extend) {
                var compiled = tmplSystem.compile(tmplContent);

                extend = extend || {};

                if (self.model.get("hasPlaceholder")) {
                    return callback(compiled, toClient);
                }

                html = compiled(_.extend(extend, self.model.toJSON()));

                if (isBrowser) {
                    self.$el.html(html);
                    if (self.model.attributes) {
                        if (!self.disabledBinding) {
                            self.bindings.unbind();
                            self.bindings.build();
                            self.bindings.bind();
                            self.bindings.sync();
                        }
                    }
                    if (callback) {
                        callback(self.$el.html(), toClient);
                    }
                } else {
                    return callback(html, toClient);
                }
            };

            _c.templateEngine.get(template, this.model.get("isInstance"), function (tmplString) {

                var nestedComp = extractComp(tmplString),
                    result = {};

                if (!nestedComp) {
                    render(tmplString);
                } else {
                    _c.async.each(nestedComp, function (subComp, cb) {
                        var id = _.uniqueId("nested_"),
                            regex = new RegExp("\{\{component " + subComp + "\}\}", "g"),
                            component = {
                                type: subComp,
                                isInstance: true,
                                dynamic: true,
                                id: id
                            },
                            initialData = _.extend(self.model.toJSON(), component),
                            inst = expose(component, initialData);

                        tmplString = tmplString.replace(regex, "{{" + id + "}}");

                        inst.view.render(function (partialml, clientSide) {
                            toClient = toClient.concat(clientSide);
                            result[id] = partialml;
                            cb(null, partialml);
                        });
                    }, function (err, final) {
                        render(tmplString, result);
                    });
                }
                return self;
            });
        }
    });

    if (isBrowser) {
        ComponentView = _c.View = ComponentView.extend({
            initialize: function (options) {
                this.template = options.template;
                this.module = options.module;
                if (!this.disabledBinding) {
                    this.bindings = rivets.bind(this.$el, {
                        model: this.model,
                        view: this
                    });
                }
                this._cInit();
            }
        });
    }

    var Components = Backbone.Collection.extend({
        model: ComponentModel
    });

    var Module = Backbone.Model.extend({
        initialize: function () {
            this.components = new Components();
        },
        add: function (name, model, collection) {
            var expose = model;
            if (collection) {
                expose = collection
            }
            this[name] = expose;
            this.components.add(expose);
        }
    });

    var Modules = Backbone.Collection.extend({
        model: Module
    });

    var App = Backbone.Model.extend({
        initialize: function (options) {
            this.modules = new Modules();
        },
        module: function (name) {

            var module = createModule(name);

            this.modules.add(module);
            this[name] = module;

            return module;
        }
    });

    var createApp = _c.app = function (id) {
        return new App({ id: id });
    };

    var cInit = function () {
        var cAttrs = this._cAttrs;
        _.each(cAttrs, function (attr) {
            if (attr["on"]) {
                this.model.on("change:" + attr["name"], this[attr["on"]], this);
            }
        }, this);
    };

    var createModule = function (name) {
        var module = new Module();
        module.name = name;
        modules[name] = module;

        return module;
    };

    var createComponent = function (name, model, view, collection) {
        if (_c.components[name]) throw name + " component already existing";

        _c.components[name] = {
            model: model,
            view: view,
            collection: collection
        };
    };

    _c.components = {};

    if (isBrowser) {
        _c.config = window.__c_conf || undefined;
    }

    var emtpy = function () {};

    _c.component = function (obj) {

        var componentName = obj.type,
            attrs = obj.attributes,
            based = ["attributes", "name", "base", "plugin", "initialize", "extendModel"],
            functions = _.omit(obj, based),
            baseModel = ComponentModel,
            baseView = ComponentView,
            extendModel = obj.extendModel || {},
            initializeView = obj.initialize || emtpy,
            collection = obj.collection,
            model,
            view;

        var extendModel = _.extend(extendModel, {
            initialize: function () {
                this._cInit();
            },
            _cInit: cInit
        });

        model = baseModel.extend(extendModel);

        model = model.extend({
            _cAttrs: attrs
        });

        view = baseView.extend(functions);
        view = view.extend({
            _cInit: initializeView
        });

        createComponent(componentName, model, view, collection);
    };

    //control need the type, the id and the key.
    var expose = _c.expose = function ( control, initValues, module ) {
        var component = _c.components[control.type] || undefined,
            hasPlaceholder = ( component.placeholders && component.placeholders.length > 0 ),
            model,
            collection,
            view;

        initValues.isInstance = component.isInstance;

        if (hasPlaceholder) {
            initValues = _.extend( initValues, {
                placeholders: component.placeholders,
                hasPlaceholder: true
            });
        }

        if (component) {
            if (component.model) {
                model = new component.model(initValues);
            } else {
                model = new ComponentModel(initValues);
            }

            if (component.collection) {
                collection = new component.collection();
            } else {
                collection = undefined;
            }
            view = new component.view({
                model: model,
                el: "." + control.id,
                collection: collection,
                module: module
            });
        } else {
            model = new ComponentModel(initValues);
            view = new ComponentView({
                model: model,
                el: "." + control.id,
                module: module
            });
        }
        _c.controls = _c.controls || [];
        _c.controls.push({
            id: control.key,
            model: model,
            view: view,
            collection: collection
        });

        if (module) {
            module.add(control.key, model, collection);
        }
        return {
            model: model,
            view: view
        };
    };


    function attachScript(options, cb) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = options.url;
        script.onload = cb;
        script.onerror = scriptLoadError;
        (document.head || document.getElementsByTagName('head ')[0]).appendChild(script);
    }

    function cosify(content, mainModule) {
        var module = mainModule,
            result = "_.define(" + module.get("name") + ", function() {" + content + "})()";
        return result;
    };

    function attachAjax(options, mainModule, cb) {
        $.get(options.url).done(function (content) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = cosify(content, mainModule);
            script.onload = cb;
        });
    }

    var scriptLoadError = function () {
        console.log(arguments);
    };

    var buildModRequest = function (modulesElem) {
        var allScript = modulesElem,
            request = "/cosy/load/comp?mod=[",
            end = "]",
            mod = [];

        _.each(allScript, function (comp) {
            var type = comp["type"],
                subComp = comp["component"];

            mod.push(type);

            if (subComp) {
                mod.push(subComp);
            }
        });

        return request + mod.join(",") + end;
    };

    var load = function () {
        var dfd = new jQuery.Deferred();

        var arrModeEl = _c.config,
            request = (arrModeEl && arrModeEl.length > 0) ? buildModRequest(arrModeEl) : "";

        if (request) {
            attachScript({
                url: request
            }, function () {
                dfd.resolve("done");
            });
        } else {
            _c.trigger("cosy-loaded");
            dfd.resolve("done");
        }

        // Return the Promise so caller can't change the Deferred
        return dfd.promise();
    };

    var parseDom = function () {
        var dfd = new jQuery.Deferred(),
            controls = {};

        var els = document.querySelectorAll("[cosy-type]");

        _.each(els, function (el) {
            var id = el.getAttribute("cosy-id"),
                type = el.getAttribute("cosy-type"),
                uniqueId = _.uniqueId("comp_"),
                control = controls[id] = {};

            el.className += " " + uniqueId;
            control.el = el;
            control.id = uniqueId;
            control.type = type;
            control.key = id;
            control.load = load;
        });

        console.log("parsing Dom is done");
        dfd.resolve(controls);

        return dfd.promise();
    };

    var getInitialValue = function (id, config) {
        var control = _.find(config, function (conf) {
            return conf.id === id;
        });
        if (control) {
            return control;
        }
        return undefined;
    };

    var parseApp = function (controls) {
        var mainModule = _c.app("app").module("main"),
            ids = _.keys(controls);

        _.each(ids, function (id) {
            var values = getInitialValue(id, _c.config);
            if (values && id.indexOf("subComp") === -1) {
                var model = expose(controls[id], values, mainModule).model;
                if (values.component) {
                    _.each(values[values.key], function (subcomp) {
                        var control = controls[subcomp.id];
                        expose(control, subcomp, mainModule);
                    });
                }
            }
        });

        mainModule.all = getInitialValue("__all", _c.config);

        return _c.trigger("cosy-loaded", mainModule);
    };

    var loadBusinessScript = function (mainModule) {

        var scripts = window.__c_scripts,
            nbScript = scripts.length,
            scriptLoaded = 0;

        scripts.forEach(function (script) {
            attachScript({
                url: script
            }, function () {
                scriptLoaded++;
                if (scriptLoaded == nbScript) {
                    _c.trigger("cosy-ready");
                }
            });
        });
    };

    _.extend(_c, Backbone.Events);

    if (isBrowser) {
        jQuery.when(parseDom(), load()).done(parseApp);
        _c.on("cosy-loaded", loadBusinessScript);
    }

}).call(this);