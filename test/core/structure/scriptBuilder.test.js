var should = require("should"),
    scriptBuilder = require("../../../lib/core/structure/scriptBuilder");

describe("Given a ScriptBuilder", function () {
    it("build method should be defined", function () {
        scriptBuilder.build.should.exist;
    });
    it("should be able to build component", function (done) {
        var test = ["button"];

        scriptBuilder.build(test, "", [{
                name: "button"
            }
        ], {}, function (result) {
            done();
        });
    });
});