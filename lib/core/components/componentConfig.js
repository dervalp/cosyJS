var DynamicConfigurationBuilder = function (scope) {
    this.scope = _.extend(this.scope, {
        type: "__all",
        id: "__all"
    });

    this.controls = [];
    this.controls.push(this.scope);
};

DynamicConfigurationBuilder.prototype.add = function (json) {
    this.controls.push(json);
};

DynamicConfigurationBuilder.prototype.build = function () {
    return JSON.stringify(result);
};