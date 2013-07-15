_c.component({
    type: "list",
    disabledBinding: true,
    listTemplate: "<div cosy-type='list' cosy-id='{{id}}'>{{{content}}}</div>",
    extendModel: {
        add: function (collection) {
            if (collection.models) {
                this.trigger("add-collection", collection);
            } else {
                this.trigger("add-model", collection);
            }
        }
    },
    initialize: function () {
        this.model.on("add-collection", this.addCollection, this);
        this.model.on("add-model", this.addModel, this)
        this.model.on("change:" + this.model.get("key"), this.addId, this);
    },
    addId: function () {
        _.each(this.model.get("items"), function (item) {
            var generatedID = _.uniqueId("subcomp_");
            item.id = generatedID;
        });
    },
    addModel: function (model) {
        if (!this.collection) {
            this.collection = new _c.Collection();
            this.collection.on("add", this.renderItem, this);
        }
        model.id = _.uniqueId("subcomp_");
        this.collection.add(model);
    },
    renderItem: function (item) {

        var componentType = this.model.get("component"),
            Komp = _c.components[componentType],
            result = {};

        //result[this.model.get("component")] = item;
        if(!Komp) {
            Komp = { model: _c.Model, view: _c.View };
        }
        var initData = item.toJSON ? item.toJSON() : item;

        var model = new Komp.model(initData);

        model.set("isInstance", true);
        model.set("dynamic", true);
        model.set("all", this.model.get("all"));

        var view = new Komp.view({
            template: this.model.get("component"),
            model: model,
            module: this.module
        });

        this.$el.append(view.render().$el);
    },
    renderItems: function (item) {
        this.renderItem(item.toJSON());
    },
    addCollection: function (collection) {
        this.collection = collection;

        this.collection.on("add", this.renderItems, this);
    },
    render: function (callback) {
        this.components = [];
        var key = this.model.get("key"),
            componentType = this.model.get("component"),
            toClient = [],
            singularKey = key.substring(0, key.length - 1),
            Komp = _c.components[componentType];

        var self = this;

        if (this.model.get("dynamic")) {
            toClient.push(_.omit(this.model.toJSON(), [this.model.get("key")]));
        }

        _.each(this.model.get(this.model.get("key")), function (item) {
            item.id = _.uniqueId("subComp_");
            item[singularKey] = item;

            var model = new Komp.model(item);

            model.set("type", componentType);
            model.set("isInstance", true);
            model.set("dynamic", true);
            model.set("all", this.model.get("all"));

            var view = new Komp.view({
                template: this.model.get("component"),
                model: model
            });

            this.components.push({
                model: model,
                view: view
            });
        }, this);

        var renderComp = function (comp, callback) {
            comp.view.render(function (html, json) {

                var toC = [];
                _.each(json, function (j) {
                    toC.push(_.omit(j, [singularKey]))
                });

                console.log(toC);

                toClient = toClient.concat(toC);

                callback(null, html);
            });
        };

        _c.async.map(this.components, renderComp, function (err, result) {
            var repeater = _c.tmplSystem.compile(self.listTemplate);
            var content = repeater({
                id: self.model.get("id"),
                content: result.join("")
            });

            callback(content, toClient);
        });
    }
});