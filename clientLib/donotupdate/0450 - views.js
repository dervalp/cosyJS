var v = Sitecore.Definitions.Views;

v.ComponentView = v.View.extend({
  listen: _.extend({}, Sitecore.Definitions.Views.View.prototype.listen, {
    "set:$this": "set"
  }),
  initialize: function () {
    if (!this.model) {
      throw "Model required in order to instantiate ComponentView";
    }
    if (!this.el) {
      throw "Element required in order to instantiate ComponentView";
    }
    var init = this.$el.data("init");
    if(init) {
      var keys = _.keys(init);
      _.each(keys, function(key) {
          this.set(key, init[key]);
      }, this.model);
    }
  },
  //PDE: really do not like this
  //JC: kinda like it :-)
  set: function(args) {
    if (!args) { return; }
    
    _.each(_.keys(args), function (attributeName) {
      this.model.set(attributeName, args[attributeName]);
    }, this);
  }
});

v.ControlView = v.ComponentView.extend({
  listen: _.extend({}, Sitecore.Definitions.Views.ComponentView.prototype.listen, {
    "toggle:$this": "toggle",
    "focus:$this": "focus",
    "show:$this": "show",
    "hide:$this": "hide"
  }),
  initialize: function () {
    this._super();
    this.model.set("isVisible", (this.$el.css("display") !== "none"));
  },
  focus: function () {
    this.$el.focus();
  },
  hide: function () {
    this.model.set("isVisible", false);
  },
  show: function() {
    this.model.set("isVisible", true);
  },
  toggle: function () {
    this.model.toggle();
  }                       
});

v.BlockView = v.ControlView.extend({
  initialize: function() {
    this._super();
    this.model.set("width", this.$el.width());
    this.model.set("height", this.$el.height());
  }
});

v.InputView = v.ControlView.extend({
  listen: _.extend({}, Sitecore.Definitions.Views.ComponentView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),  
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

v.ButtonBaseView = v.ControlView.extend({
  listen: _.extend({}, Sitecore.Definitions.Views.ControlView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  click: function() {
    if(this.model.get("isEnabled")) {
        var invocation = this.$el.attr("data-sc-click");
        if (invocation) {
            Sitecore.Helpers.invocation.execute(invocation, { control: this, app: this.app });
        }
    }
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

_sc.Definitions.Collections = _sc.Definitions.Collections || [];

fctry.createComponent("ComponentBase", models.ComponentModel, views.ComponentView, ".sc-componentbase");
fctry.createComponent("ControlBase", models.ControlModel, views.ControlView, ".sc-controlbase");
fctry.createComponent("BlockBase", models.BlockModel, views.BlockView, ".sc-blockbase");
fctry.createComponent("ButtonBase", models.ButtonBaseModel, views.ButtonBaseView, ".sc-buttonBase");
fctry.createComponent("InputBase", models.InputModel, views.InputView, ".sc-inputbase");
fctry.createComponent("PageBase", models.Model, views.View, "body");
fctry.createBindingConverter({
  name: "Has",
  convert: function(array) {
    if(array && array[0]) {
      if(_.isArray(array[0])) {
        if(array[0].length === 0) {
          return false;
        }
        return true;
      }
      return true;
    }
    return false;  
    
  }
});
fctry.createBindingConverter({
  name: "Not",
  convert: function(array) {
    return !(array && array[0]);
  }
});