var should = require("should"),
    layoutBuilder = require("../../../lib/core/structure/layoutBuilder");

describe("Given a layoutBuilder", function () {
    it("build method should be defined", function () {
        layoutBuilder.build.should.exist;
    });
});