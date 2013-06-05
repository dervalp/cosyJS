_c.component({
    type: "repeater",
    initialize: function() {
        console.log("update");
        this.model.on("change:collection", this.update, this);
    },
    update: function() {
        var collection = this.model.get("collection");
        var $el = this.$el;
        collection.each(function(model) {
            var view = new _c.View({ model: model});
            view.render(function(html) {
                $el.append(html);
            });
            
        });
    }
});