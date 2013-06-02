models.ComponentModel = models.Model.extend({
  initialize: function() {
  }
});

models.ControlModel = models.ComponentModel.extend({
  initialize: function() {
    this._super();
    this.set("isVisible", true);
  },
  toggle: function () {
    this.set("isVisible", !this.get("isVisible"));
  }
});

models.BlockModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("width", 0);
    this.set("height", 0);
  }
});

models.InputModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});

models.ButtonBaseModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});