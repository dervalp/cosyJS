var Backbone = require("backbone"),
    rivets = require("rivets"),
    tmplSystem = require("Handlebars"),
    _ = require("underscore");

var isBrowser = typeof window !== 'undefined';
if(!isBrowser) {
  Backbone.$ = function () {
    return {
      attr: function() { },
      off: function() { },
      on: function() { }
    }
  };  

  Backbone.$.get = function() { };
}

(function () {
    "use strict";

var __domain = "http://localhost:3000";

var root = this,
    _cosy = this._c,
    _c;

if (typeof exports !== 'undefined') {
    _c = exports;
} else {    
    _c = root._c = {};
}

if(isBrowser) {
  window._c = _c;
}

_c.version = "0.0.1";


_c.templates = {};

var templateEngine = function() {
  var cache = {};

  return {
    get: function(path, isInstance, cb) {
      var template = cache[path];
      if(!template) {
        Backbone.$.get("template/" + path, function(data) {
          var compiled = tmplSystem.compile(data);
          cache[path] = compiled;

          return cb(compiled);
        });
      } else {
        return cb(template);
      }
    }
  };
};

_c.templateEngine = templateEngine();

_c.setEngine = function(tmplEngine) {
  _c.templateEngine = tmplEngine;
};

var modules = {};

_c.define = function(name, content) {
  var module;

  if(!content) {
    content = name;
    module = modules["main"];
  } else {
    module = modules[name]
  }

  if(_.isFunction(content)) {
    return content.call(module, Backbone, _);
  }
  if(_.isObject(content)) {
    module = _.extend(module, content);
    module.initialize(Backbone, _);
  };
};
/**
 * Rivets adapters
 */
if(isBrowser) {
  rivets.configure({
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) { callback(v) };
        obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        obj.set(keypath, value);
      }
    }
  });

  rivets.config.handler = function(context, ev, bindings) {
    var key = bindings.key,
        keypath = bindings.keypath,
        models = bindings.view.models;

    if(key === "model") {
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
  initialize: function(options) {
    this.template = options.template || undefined;
    this.module = options.module;
  },
  render: function (cb) {
    var self = this,
        template = this.template || this.model.get("type") || undefined;

    _c.templateEngine.get(template, this.model.get("isInstance"), function(tmpl) {
      var html = tmpl(self.model.toJSON());
      if(isBrowser) {
        self.$el.html(html);
        self.bindings.unbind();
        self.bindings.build();
        self.bindings.bind();
        self.bindings.sync();
        if(cb) {
          cb(html);
        }
      } else {
        return cb(html);
      }
    });
    return self;
  }
});

if(isBrowser) {
  ComponentView = _c.View = ComponentView.extend({
    initialize: function(options) {
      this.template = options.template;
      this.module = options.module;
      this.bindings = rivets.bind(this.$el, { model: this.model, view: this });
      this._cInit();
    },
     _cInit: function () { }
  });
}

var Components = Backbone.Collection.extend({
    model: ComponentModel
});

var Module = Backbone.Model.extend({
    initialize: function() {
        this.components = new Components();
    },
    add: function(name, model, collection) {
        var expose = model;
        if(collection) {
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
    initialize: function(options) {
        this.modules = new Modules();
    },
    module: function(name) {

      var module = createModule(name);
      
      this.modules.add(module);
      this[name] = module;

      return module;
    }
});

/**
 * Factories
 */
var createApp = function(id) {
    return new App({ id: id});
};

var cInit = function() {

  var cAttrs = this._cAttrs;

  /*here we should use JSON init object instead */
  _.each(cAttrs, function(attr) {
    if(attr["on"]) {
      this.model.on("change:" + attr["name"], this[attr["on"]], this);
    }
  }, this);
};

var createModule = function(name) {
    var module = new Module();
    module.name = name;
    modules[name] = module;

    return module;
};

var createComponent = function(name, model, view, collection) {
    if(_c.components[name]) { throw name + " component already existing"; }

    _c.components[name] = {
        model: model,
        view: view,
        collection: collection
    };
};

_c.app = createApp;
_c.components = { };
if(isBrowser) {
  _c.config = window.__c_conf || undefined;
}

var emtpy = function() {};

_c.component = function(obj) {

    var componentName = obj.type,
        attrs = obj.attributes,
        based = ["attributes", "name", "base", "plugin", "initialize", "listenTo", "extendModel"],
        functions = _.omit(obj, based),
        baseModel = ComponentModel,
        baseView = ComponentView,
        extendModel = obj.extendModel || { },
        initializeView = obj.initialize || emtpy,
        collection = obj.collection,
        exposed,
        model,
        view;
    
    var extendModel = _.extend(extendModel, {
        initialize: function() {
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

    if(obj["listenTo"]) {
      var listen = {},
          parent = baseView.prototype.listen,
          listenTo = obj["listenTo"],
          listenKeys = _.keys(listenTo);

      _.each(listenKeys, function(key){
        //build the listen
        listen[key + ":$this"] = listenTo[key]
      });
      listen = _.extend(parent, listen);

      ComponentModel = _.extend(ComponentModel, listen);
    }

    createComponent(componentName , model, view, collection);
};

/**
* Attaches a script to the DOM and executes it.
* @param {options} object, normally with .url
* @param {cb} callback, called when script is loaded
*/
function attachScript(options, cb){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = options.url;
    script.onload = cb;
    script.onerror = scriptLoadError;
    (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
}

function cosify (content, mainModule) {
  var module = mainModule,
      result = "_.define("+ module.get("name") +", function() {" + content + "})()"; 
  return result;
};

function attachAjax(options, mainModule, cb) {
  $.get(options.url).done(function(content) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = cosify(content, mainModule);
    script.onload = cb;
  }); 
}


var scriptLoadError = function() {
    console.log(arguments);
};
var buildModRequest = function(modulesElem) {
    var allScript = modulesElem,
        request = __domain + "/load/comp?mod=[",
        end = "]",
        mod = [];

    _.each(allScript, function(comp) {
        var type = comp["type"];
        mod.push(type);
    });

    return request + mod.join(",") + end;
};

var load = function () {
    var dfd = new jQuery.Deferred();
 
    var arrModeEl = _c.config,
        request = (arrModeEl && arrModeEl.length > 0) ? buildModRequest(arrModeEl) : "";
    
    if(request) {
        attachScript({ url: request }, function() {
            dfd.resolve("done");
        });
    } else {
        _c.trigger("cosy-loaded");
        dfd.resolve("done");
    }
 
    // Return the Promise so caller can't change the Deferred
    return dfd.promise();
};

var parseDom = function() {
  var dfd = new jQuery.Deferred(),
      controls = {};

  var els = document.querySelectorAll("[cosy-type]");

  _.each(els, function(el) {
    var id = el.getAttribute("cosy-id"),
        type = el.getAttribute("cosy-type"),
        uniqueId = _.uniqueId("comp_"),
        control = controls[id] = {};

    el.className += " " + uniqueId;
    control.el = el;
    control.id = uniqueId;
    control.type = type;
    control.key = id;
  });

  console.log("parsing Dom is done");
  dfd.resolve(controls);

  return dfd.promise();
};

var buildInitialValues = function(id, config) {
  var control = _.find(config, function (conf) {
    return conf.id === id;
  });
  if(control) {
    return control.data;
  }
  return { }; 
};

var parseApp = function(controls) {
  var mainModule = _c.app("app").module("main"),
      ids = _.keys(controls);

  _.each(ids, function(id) {
    exposedComponent(controls[id], buildInitialValues(id, _c.config), mainModule);
  });
  return _c.trigger("cosy-loaded", mainModule);
};

var loadBusinessScript = function (mainModule) {

  var scripts = window.__c_scripts, nbScript = scripts.length, scriptLoaded = 0;

  scripts.forEach(function(script){
    attachScript({ url: script }, function(){
      scriptLoaded++;
      if(scriptLoaded == nbScript) {
        _c.trigger("cosy-ready");
      }
    });
  });
};

var exposedComponent = function(control, initValues, module) {
  var component = _c.components[control.type] || undefined,
      model,
      collection,
      view;

  if(component) {
    if(component.model) {
      model = new component.model(initValues);
    } else {
      model = new ComponentModel(initValues);
    }

    if(component.collection) {
      collection = new component.collection();
    } else {
      collection = undefined;
    }
    view = new component.view({ model: model, el: "." + control.id, collection: collection, module: module });
  } else {
    //try to create based html
    model = new ComponentModel(initValues);
    view = new ComponentView({ model: model, el: "." + control.id, module: module });
  }
  _c.controls = _c.controls || [];
  _c.controls.push({ id: control.key, model: model, view: view, collection: collection });
  module.add(control.key, model, collection);

};

_.extend(_c, Backbone.Events);

if(isBrowser) {
  jQuery.when(parseDom(), load()).done(parseApp);
  _c.on("cosy-loaded", loadBusinessScript);
}

}).call(this);