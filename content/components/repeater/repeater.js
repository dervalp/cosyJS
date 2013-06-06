_c.component({
    type: "repeater",
    initialize: function() {
        this.model.on("change", this.afterRender, this);
    },
    afterRender: function() {
        var $el = this.$el;
        var collection = this.model.get("collection");
        collection.fetch({
            success : function(todos) {
                todos.each(function(model) {
                    var view = new _c.View({ model: model});
                    view.render(function(html) {
                        $el.append(html);
                    });
                });
            }
        });
    }
});