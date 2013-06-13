var componentBuilder = require("../../../lib/core/structure/componentBuilder"),
    should = require("should");

var _c = function () {
    var comp = {};

    return {
        component: function (obj) {
            comp[obj.type] = obj;
        },
        components: comp
    };
}();

describe("Given a componetBuilder", function () {
    it("should be defined", function () {
        componentBuilder.should.exists;
    });
    it("should have a build method", function () {
        componentBuilder.build.should.exists;
    });
    describe("with a existing Path", function () {
        var compBuilder = componentBuilder;

        it("load", function (done) {
            compBuilder.build(_c, function (_c, configuration) {
                Object.keys(_c.components).length.should.eql(9);
                configuration.length.should.eql(9);
                done();
            });
        });
    });
});