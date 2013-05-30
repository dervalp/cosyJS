var appPpl = new ppl.Pipeline("Application");

/**
 * Initialized all the components
 */

var hasPublicFunctions = function (defaults) {
  if (!defaults) {
    return false;
  }
  return (_.keys(defaults).length > 0);
};

var exposedCollection = function (collection, defaults) {
  /*current exposed nothing*/
  return {};
};

var exposedModel = function (model, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      if (model.attributes[funcName] !== undefined) {
        obj[funcName] = function () {
          if (arguments.length) {
            model.set(funcName, arguments[0]);
            return arguments[0];
          }
          else {
            return model.get(funcName);
          }
        };
      }
      else {
        obj[funcName] = function (args) {
          model[funcName].call(model, args);
        };
      }
    });
  }
  return obj;
};

var exposedView = function (view, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      obj[funcName] = function (args) {
        view[funcName].call(view, args);
      };
    });
  }

  return obj;
};

var exposedComponent = function (component, componentEl, appName, hasExclude, hasNested, selector, app, context, verifyNestedApp) {
  var $component = $(componentEl),
    uniqueId,
    controlName,
    model,
    collection,
    view;

  if(verifyNestedApp) {
      var $subApps = $component.find("[data-sc-app]");
      if($subApps.length > 0) {
         $.each($subApps, function(){
          $(this).addClass("data-sc-waiting")
         });
      }
  }
  //if it has data on sc-app, it means the component has been already register
  if (!$component.data("sc-app")) {

    uniqueId = _.uniqueId('sc_' + component.type + '_');
    controlName = $component.attr("data-sc-id");  
    if(app.appId) {
      controlName = app.appId + ":" + controlName;  
    }

    var newClass = _.filter($component.prop("class").split(" "), function (className) {
      return (className.indexOf('sc_') === -1);
    });

    $component.prop("class", newClass.join(" "));
    $component.addClass(uniqueId); //add a uniqueID enforce this !

    if (hasExclude) {
      if ($("[data-sc-exclude] " + "." + uniqueId).length) {
        return { }; //return empty object
      }
    }
    if (hasNested) {
      if ($component.closest("[data-sc-app]").attr("id") && "#" + $component.closest("[data-sc-app]").attr("id") != selector) {
        return { };
      }
    }

    model = new component.model({ type: uniqueId, name: controlName });
    $component.data("sc-app", appName); //prefer to not relying on DOM

    $component.addClass("data-sc-registered");

    if (component.collection) {
      collection = new component.collection();
    }

    /*adding Behaviors*/
    var behaviors = $component.data("sc-behaviors");
    if (behaviors) {
      extendBehavior(behaviors, component.view);
    }

    view = new component.view({ el: "." + uniqueId, model: model, collection: collection, app: app });

    view.$el.find("[data-bind]").addClass("data-sc-registered");
    /*if(! component.model.prototype.defaults) { component.model.prototype.defaults = {}; }
    if(! component.view.prototype.defaults) { component.view.prototype.defaults = {}; }
    
    if(_.intersection(_.keys(component.model.prototype.defaults), _.keys(component.view.prototype.defaults)).length > 0) {
        $component.data("sc-app", null); //deregister the component before breaking
        throw "Your view and your model from component:" + controlName + ", are exposing property under the same name";
    }*/

    app[controlName] = model; /*;*/

    //_.extend(app[controlName], exposedModel(model, component.model.prototype.defaults));
    //_.extend(app[controlName], exposedView(view, component.view.prototype.defaults));

    if (collection) {
      _.extend(app[controlName], exposedCollection(collection, component.collection.prototype.defaults));
    }
    context.Controls.push({ name: controlName, model: model, view: view, collection: collection });

    if(verifyNestedApp) {
      var $deferedKO = $component.find(".data-sc-waiting");
      $deferedKO.each(function(){
        $(this).removeClass("data-sc-waiting");
      });
    }
  }

  return app;
};

// Returns object containing depth and element
// like this: {depth: 2, element: [object]}
var findDeepestNotRegisteredNestedChild = function (parent) {

    var result = {depth: 0, element: parent};

    parent.find("[data-sc-hasnested]").each(function(idx) {
        var child = $(this);

        if(!child.hasClass("data-sc-registered")) {
          var childResult = findDeepestNotRegisteredNestedChild(child);
          if (childResult.depth + 1 > result.depth) {
              result = {
                  depth: 1 + childResult.depth, 
                  element: childResult.element
              };
          }
        }
    });

    return result;
}

var getScope = function (name, id) {

  if (!name) {
    id = "body";
    name = "app";
  }

  if (!id) {
    id = name;
  }

  if (id !== "body" && id.indexOf("#") < 0) {
    id = "#" + id;
  }

  return {
    name: name,
    el: id,
    $el: $(id)
  };
};

var extendBehavior = function (behaviors, view) {
  _.each(behaviors.split(" "), function (behav) {
    view.addBehavior(Sitecore.Behaviors[behav]);
  });
};

var initialization = {
  priority: 1000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    context = context || { };
    var name = context.name
      , id = context.id
      , mainApp = context.mainApp
      , app = context.app
      , scoped = getScope(name, id)
      , excludeDom = $(scoped.$el).find("[data-sc-exclude]")
      , hasExclude = excludeDom.length || false
      , hasNested = $(scoped.$el).find("[data-sc-app]").length || false
      , hasNestedComponents = [];

    context.Controls = [];

    app = app || new Sitecore.Definitions.App(); //empty app

    if (!mainApp) { mainApp = Sitecore; }
    //throw if app already in the page
    if (mainApp[scoped.name]) { throw "already an app with this name"; }

    app.ScopedEl = scoped.$el;
    app.name = scoped.name;
    //forEach component in Sitecore, we look for a corresping EL

    if (_sc.Components && _sc.Components.length > 0) {
      _.each(_sc.Components, function (component) {
        // we are just looking for component which are not registered
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
          //create a Control Object and add it to the App
          if (!$(this).data("sc-hasnested")) {
            exposedComponent(component, this, scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context);
          } else {
            //defering until not nested are done
            hasNestedComponents.push(component);
          }
        });
      });
    }

    if (hasNestedComponents.length > 0) {
      _.each(hasNestedComponents, function (component) {
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
            /*sub nested*/
            var element = $(this);
            var nbNested = $(this).find("[data-sc-hasnested]").length;
            
            while(nbNested > 0) {
              var deepestChild = findDeepestNotRegisteredNestedChild(element);

              _.each(hasNestedComponents, function(subcomp) {
                if(deepestChild.element.hasClass(subcomp.el.substring(1))) {
                  exposedComponent(subcomp, deepestChild.element, scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context, true);
                }
              }, this);
              nbNested--;
            }

            exposedComponent(component, this, scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context, true);
        });
      });
    }

    /*it is time to register events*/
    _.each(context.Controls, function (ctrl) {
      if (ctrl.view.listen) {
        var eventList = _.keys(ctrl.view.listen);
        _.each(eventList, function (eventName) {
          var e = eventName;
          if (e.indexOf(":$this") >= 0) {
            var ctrlId = ctrl.view.$el.attr("data-sc-id");
            if (ctrlId) {
              e = e.replace("$this", ctrlId);
            } else { 
              //console.log("Control has no 'data-sc-id' attribute - event '" + eventName + "' is not bound");
              return;
            }
          }
          app.on(e, ctrl.view[ctrl.view.listen[eventName]], ctrl.view);
        });
      }
    });

    //not exposed to sitecore anymore
    if (mainApp === Sitecore) {
      if (__SITECOREDEBUG) {
        mainApp[scoped.name] = app;
      } else {
        mainApp[scoped.name] = "application";
      }
    } else {
      mainApp[scoped.name] = app;
      mainApp["nested"] = mainApp["nested"] || [];
      mainApp["nested"].push(app);
    }

    app.Controls = context.Controls;
    scoped.$el.find("[data-sc-app]").each(function () {
      var $app = $(this),
          id = $app.attr("id");

      //require
      var dep = $app.attr("data-sc-require");
      if(dep) {
        require(dep, function (id, app) {
          var instance = new app();
          instance.run(id, id, app);
        });
      } else {
        _sc.Factories.createApp({
          name: id,
          id: id,
          mainApp: app
        });
      }
    });

    context.current = app;
  }
};

 var getConverter = function(converterName) {
  var converter = _sc.BindingConverters[converterName];
  if(!converter) {
    return undefined;
  } else {
    return converter;
  }
}

var getValue = function(bindingForOneProperty) {
  if(bindingForOneProperty.converter) {
    var parameters = [];

    _.each(bindingForOneProperty.from, function (setup) {
        parameters.push(setup.model.get(setup.attribute));
    });
    return bindingForOneProperty.converter(parameters);
  } else {
    var singleModel = bindingForOneProperty.from[0].model,
        value = bindingForOneProperty.from[0].attribute;
    
    return singleModel.get(value);  
  }
}

var createBinding = function(bindingForOneProperty) {
   _.each(bindingForOneProperty.from, function(f) {
    f.model.on("change:" + f.attribute, function() {
      bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
    });
  });

  bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
};

var getUniformAttribute = function(model, attribute) {
  if(!model.attributes[attribute]) {
    return (attribute.charAt(0).toLowerCase() + attribute.slice(1));
  } else {
    return attribute;
  }
};

var getUniformModel = function(app, model) {
  if(!app[model]) {
    return app[(model.charAt(0).toUpperCase() + model.slice(1))];
  } else {
    return app[model];
  }
};


var applyBinding = function ($el, app, scId) {
  var namespace = scId,
      conf = $el.attr("data-sc-bindings"),
      bindingConfigurationList = [],
      leftModel = app[namespace];
    //backward compatibily
    if(conf.indexOf("{") != 0) {
      //try to make the old bindings work with new one
      var compatibleBindings = [];

      _.each(conf.split(","), function(singleBinding) {
        var compatibleBinding = [];

        _.each(singleBinding.split(":"), function(part){
          compatibleBinding.push('"' + part + '"');
        });

        compatibleBindings.push(compatibleBinding.join(":"));
      });
      conf = "{" + compatibleBindings.join(",") + "}";
    }

    try {
       var json = JSON.parse(conf);
       _.each(_.keys(json), function(key){

        var bindingConfiguration = { from: [], to: key, converter: undefined, model: leftModel },
            config = json[key],
            modelPath,
            model,
            attribute;
        
        bindingConfiguration.to = getUniformAttribute(leftModel, key);

        if(!_.isObject(config)) {
          //classic binding Items:SearchDatasource.Items
          model = app[config.split(".")[0]];
          attribute = getUniformAttribute(model, config.split(".")[1]);

          /*if(!model.attributes[attribute]) {a
            
          }*/
          bindingConfiguration.from.push({ model: model, attribute: attribute });
        } else {
          bindingConfiguration.converter = getConverter(config.converter);

          _.each(config.parameters, function(value) {
            model =  getUniformModel(app, value.split(".")[0]);

            attribute = getUniformAttribute(model, value.split(".")[1]);
            
            bindingConfiguration.from.push({ model:model, attribute: attribute });
          });
        }
        bindingConfigurationList.push(bindingConfiguration);
      });

      _.each(bindingConfigurationList, createBinding);
    }
    catch (ex) {
      //alert("Failed to data-bind: " + scId + "." + left + " => " + right + "\n" + ex);
      throw "Failed to data-bind: " + scId + "\n" + ex;
    }

};

var applyingCrossBinding = {
  priority: 1500,
  execute: function (context) {
    if (context.current.Controls.length === 0) {
      return;
    }

    _.each(context.current.Controls, function (control) {
      if (control.view.$el.attr("data-sc-bindings")) {
        applyBinding(control.view.$el, context.current, control.view.$el.attr("data-sc-id"));
      }
    });
  }
};

var beforeRenderTime = {
  priority: 2000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.beforeRender) {
        //we execute it
        control.view.beforeRender();
      }
    });
  }
};
/**
 * Render Methods
 */
var renderingTime = {
  priority: 3000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.render) {
        //we execute it
        control.view.render();
      }
    });
  }
};

var afterRenderTime = {
  priority: 4000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.afterRender) {
        //we execute it
        control.view.afterRender();
      }
    });
  }
};

appPpl.add(initialization);
appPpl.add(applyingCrossBinding);
appPpl.add(beforeRenderTime);
appPpl.add(renderingTime);
appPpl.add(afterRenderTime);

Sitecore.Pipelines.add(appPpl);