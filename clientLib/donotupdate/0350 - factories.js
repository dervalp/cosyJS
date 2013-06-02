var scInit = function() {

  var scAttrs = this._scAttrs;

  _.each(scAttrs, function(attr) {
    if(attr["value"] && attr["value"].indexOf("$el.") !== -1) {
      var value,
          path = attr["value"].substring("$el.".length); 

      if(path.indexOf(":") !== -1) {

        var paths = path.split(":");

        if(paths.length === 2) {

          var valueFromDOM = this.$el[paths[0]](paths[1]);

          if(typeof valueFromDOM !== 'undefined') {
            this.model.set(attr["name"], valueFromDOM);  
          } else {
            //we check if there is a default values
            if(attr["defaultValue"]) { //we fallback to the default value if there is one
              this.model.set(attr["name"], attr["defaultValue"]);  
            }
          }
        }
      } else {
        this.model.set(attr["name"], this.$el[path]());
      }
    }
  }, this);

  _.each(scAttrs, function(attr) {
    if(attr["on"]) {
      this.model.on("change:" + attr["name"], this[attr["on"]], this);
    }
  }, this);
};

var _scInitDefaultValueFromLocalStorage = function() {
  if(this._scAttrs) {
    _.each(this._scAttrs, function(attr) {
      var keys = _.keys(attr);
      var valFromLocalStorage = this.localStorage.get(attr["name"]);
      if(valFromLocalStorage) {
        this.set(attr["name"], valFromLocalStorage)
      } else {
        if(keys.indexOf("defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
          this.set(attr["name"], null);
        } else if(keys.indexOf("defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
          this.set(attr["name"], attr["value"]);  
        } else if(keys.indexOf("defaultValue") > -1) {
          this.set(attr["name"], attr["defaultValue"]);
        } else {
          this.set(attr["name"], undefined);
        }
      }
    }, this);     
  }
}

var scDefaultValue = function() {
  if(this._scAttrs) {
    _.each(this._scAttrs, function(attr) {
      var keys = _.keys(attr);

      if(keys.indexOf("defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
        this.set(attr["name"], null);
      } else if(keys.indexOf("defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
        this.set(attr["name"], attr["value"]);  
      } else if(keys.indexOf("defaultValue") > -1) {
        this.set(attr["name"], attr["defaultValue"]);
      } else {
        this.set(attr["name"], undefined);
      }
    }, this);     
  }
};

var localStoragetSet = function(model) {
  var baseModel = model;
  return function() {
    baseModel.prototype["set"].apply(this, arguments);

    var options = arguments[2];

    if(_.isObject(arguments[0]) && (!options || !options.local)) {
      //full object to simple object
      var values = arguments[0];
      var keys = _.keys(values);
      _.each(keys, function(key) {
        this.localStorage.set(key, values[key]);
      }, this);
    }
    if(!_.isObject(arguments[0]) && (!options || !options.computed)) {
      this.localStorage.set(arguments[0], arguments[1]);
    }
  };
};

_.extend(fctry, {
  /**
   * createBehavior will add behavior in the Sitecore.Behaviors namespace
   * @params {name} the name of your behavior
   * @params {behavior} the object you want to turn as a behavior
   * @returns the behavior
   */
  createBehavior: function(name, behavior) {
    _sc.Behaviors = _sc.Behaviors || { };

    if(_sc.Behaviors[name]) { throw "There is already a behavior with the same name"};
    
    _sc.Behaviors[name] = behavior;

    return _sc.Behaviors[name];
  },
  /**
   * createComponent, base API to create simple Component
   * @params: {
   *  name: String - "Name of the Control",
   *  selector: String - "css class that will help Sitecore to register approriate Component"
   *  attrs: [{ }] - "array of object which can define the default value and the value"
   *  initialize: funct - The function that will be exected during the Initialize Time of the Run Method
   *  functions: { } - "the function that will be attached to the component"
   * }
   *          
   */
  createBaseComponent: function(obj) {
    if(!obj.name || !obj.selector) { throw "provide a name and/or a selector"; }

    var componentName = obj.name
      , selector = obj.selector
      , attrs = obj.attributes
      , initialize = obj.initialize
      , base = obj.base
      , based = ["attributes", "name", "selector", "base", "plugin", "initialize", "listenTo", "_scInitFromObject", "extendModel", "_scInit", "_scInitDefaultValue"]
      , functions = _.omit(obj, based)
      , baseModel = models.Model
      , baseView = views.View
      , baseComponent
      , isLocalStorage = obj.localStorage
      , extendModel = obj.extendModel || { }
      , exposedModel
      , collection = obj.collection
      , exposed;

    if(base) {
      baseComponent = _.find(_sc.Components, function(comp) { return comp.type === base; });
    }

    if(baseComponent) {
      baseModel = baseComponent.model;
      baseView = baseComponent.view;
    }

    var ComponentModel;
    if(isLocalStorage) {
      extendModel = _.extend(extendModel, {
        initialize: function() {
          this._super();
          this._scInitDefaultValueFromLocalStorage();
        },
        set: localStoragetSet(baseModel)
      }, {
        useLocalStorage: true
      });

      ComponentModel = baseModel.extend(extendModel);
    } else {
      extendModel = _.extend(extendModel, {
        initialize: function() {
          this._super();
          this._scInitDefaultValue();
        }
      });
      ComponentModel = baseModel.extend(extendModel);
    }
   
    var ComponentView = baseView.extend({
      initialize: function() {
        this._super();
        if(this._scInitFromObject) {
          this._scInit();
          this._scInitFromObject();
        } else {
          this._scInit();
        }
      }
    });

    ComponentModel = ComponentModel.extend({
      _scAttrs: attrs,
      _scInitDefaultValue: scDefaultValue,
      _scInitDefaultValueFromLocalStorage: _scInitDefaultValueFromLocalStorage
    });

    exposed = _.extend(functions, {
      _scAttrs: attrs,
      _scInit: scInit,
      _scInitFromObject: initialize
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

    var exposedCollection;
    if(collection) {
      exposedCollection = Backbone.Collection.extend({
        model: collection
      });
    }

    ComponentView = ComponentView.extend(exposed);

    return _sc.Factories.createComponent(componentName, ComponentModel, ComponentView, selector, exposedCollection);    
  },
  /**
   * createComponent will create a component inside the Sitecore.Components namespace
   * @param {type} string which defines the namespace
   * @param {model}
   * @param {view}
   * @param {el} the selector
   * @param {collection} optionnal, if you want a collection in your component
   * @returns a component
   */
  createComponent: function(type, model, view, el, collection) {
    var component;

    if(!_.isString(type) || !model || !view || !_.isString(el)) { throw "please provide a correct: type (str), model, view and el (html class or id)";}

    _sc.Components = _sc.Components || [];
    _sc.Definitions.Models[type] = model;
    _sc.Definitions.Views[type] = view;

    if(collection) { _sc.Definitions.Collections[type] = collection; }

    _.each(_sc.Components, function(component) {
      if(component.el === el) {  throw "you are trying to add compoment with the same el (.class or #id)"; }
    });

    component = {
        type: type,
        model: model,
        view: view,
        el: el,
        collection: collection
    };

    _sc.Components.push(component);

    return component;
  },
  /**
   * Creating an application object
   * @param {name} the name of your application
   * @param {id} the #id
   * @param {mainApp} the root app
   * @param {app} the current app
   * @returns an application object
   */
  createApp: function(name, id, mainApp, app) {
    var context = { };

    if(_.isObject(name)) {
      context = name;
      _sc.Pipelines.Application.execute(context);
      return context.current;
    } else {
      context.name = name;
      context.id = id;
      context.mainApp = mainApp;
      context.app = app;

      _sc.Pipelines.Application.execute(context);
      return context.current;
    }
  },
  /**
   * Creating an application object
   * @param {pageUniqueId}
   * @param {id} the #id
   * @returns an application object
   */
  createPageCode: function(pageUniqueId, obj) {
    var rs;
    rs = _sc.Definitions.App.extend(obj);
    rs = rs.extend({ appId: pageUniqueId});
    return rs;
  },
  /*
  convert: {
    name:"hasValue",
    convert: function(param, //params from the converter) {
      return "value";
    }
  }
  */
  createBindingConverter: function(convert) {
    if(!convert.name || !convert.convert) { throw "invalid binding converter"; }
    if(_sc.BindingConverters && _sc.BindingConverters[convert.name]) { throw "already a converter with the same name"; }

    _sc.BindingConverters = _sc.BindingConverters || {};
    _sc.BindingConverters[convert.name] = convert.convert;
  }
});
