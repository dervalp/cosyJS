var _ = require("../../lib/utils/async"),
    should = require("should");

describe("Given a async", function () {
    it("should be defined", function () {
        _.should.exists;
    });
    it("should have async", function () {
        _.async.should.exists;
    });
    it("should have each", function () {
        _.async.each.should.exists;
    });
    it("should have map", function () {
        _.async.map.should.exists;
    });
});