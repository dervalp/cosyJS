_c.component({
    type: "repeater",
    initialize: function() {
        this.model.on("change", this.afterRender, this);
    },
    add: function(model) {
        var view = new _c.View({ model: model });
        this.$el.append(view.render().$el);
    },
    afterRender: function() {
        var self = this;
        var collection = this.model.get("collection");
        collection.fetch({
            success : function(collections) {
                collections.each(function(model) {
                    console.log(model);
                    var view = new _c.View({ model: model });
                    self.$el.append(view.render().$el);
                });
                collection.on("add", self.add, self);
            }
        });
    }
});