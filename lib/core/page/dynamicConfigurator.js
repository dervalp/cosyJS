var _ = require("underscore");

var dynamicConfigurator = function (scope) {
    this.scope = _.extend(scope, {
        type: "__all",
        id: "__all"
    });

    this.controls = [];
    this.controls.push(this.scope);
};

dynamicConfigurator.prototype.add = function (json) {
    this.controls.push(json);
};

dynamicConfigurator.prototype.build = function () {
    return JSON.stringify(this.controls);
};

module.exports = dynamicConfigurator;