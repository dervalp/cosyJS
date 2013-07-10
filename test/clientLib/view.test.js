var should = require("should"),
    Backbone = require("backbone"),
    _c = require("../../clientLib/cosy");

describe("Given a cosy View", function () {
    it("should have a cosy View", function () {
        _c.View.should.exists;
    });
    describe("instanciate without parameter", function () {
        var view = new _c.View();
        
        it("should be able to instanciate a cosy Model", function () {
            view.should.exists;
        });
        it("should a _cInit function in order to setup correctly the View", function () {
            view._cInit.should.exists;
        });
        it("should have a Render function", function () {
            view.render.should.exists;
        });
    });
});