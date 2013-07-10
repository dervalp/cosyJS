var should = require("should"),
    _c = require("../../clientLib/cosy");

describe("Given c.js it should work serverside", function () {
    it("should exist", function () {
        _c.should.exists;
    });
    it("should have component function", function () {
        _c.component.should.exists;
    });
    it("should have a isBrowser variable", function () {
        _c.isBrowser.should.exists;
    });
    it("should have a version variable", function () {
        _c.VERSION.should.exists;
    });
    it("should have a tmplSystem variable to store the current template engine", function () {
        _c.tmplSystem.should.exists;
    });
    it("should have a templateEngine engine to store the current template engine", function () {
        _c.templateEngine.should.exists;
    });
    it("should have a method to set a templateEngine", function () {
        _c.setEngine.should.exists;
    });
    it("should have a define method engine to store the current template engine", function () {
        _c.define.should.exists;
    });
    it("should have a cosy View", function () {
        _c.View.should.exists;
    });
    it("should have an app function", function () {
        _c.app.should.exists;
    });
    it("should be able to create an app", function() {
        var app = _c.app("name");
        app.should.exist;
        app.module.should.exist;
        app.modules.length.should.equal(0);
    });
    it("should be able to create an app and a module", function() {
        var app = _c.app("name");
        var module = app.module("test");
        app.test.should.exist;
        app.modules.length.should.equal(1);
        app.test.should.exist;
    });
    it("should have an expose method", function () {
        _c.expose.should.exists;
    });
    it("should have a component method", function () {
        _c.component.should.exists;
    });
    it("should have an expose method", function () {
        _c.expose.should.exists;
    });
    it("should have an on method", function () {
        _c.on.should.exists;
    });
    it("should have an off method", function () {
        _c.off.should.exists;
    });
    it("should have a trigger method", function () {
        _c.trigger.should.exists;
    });
});