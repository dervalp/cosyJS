var should = require("should"),
    Backbone = require("backbone"),
    _c = require("../../clientLib/cosy");

describe("Given a cosy Model", function () {
    it("should have a cosy model", function () {
        _c.Model.should.exists;
    });
    it("should be able to instanciate a cosy Model", function () {
        var model = new _c.Model();
        model.should.exists;
    });
});