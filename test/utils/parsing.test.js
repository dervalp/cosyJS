var parsingHelper = require("../../lib/utils/parsing"),
    should = require("should");

describe("Given a Parsing Utils", function () {
    it("should be defined", function () {
        parsingHelper.should.exists;
    });
    it("should have a extractType", function () {
        parsingHelper.extractType.should.exists;
    });
    it("should have a extractPlaceholders", function () {
        parsingHelper.extractPlaceholders.should.exists;
    });
    it("should have a extractComp", function () {
        parsingHelper.extractComp.should.exists;
    });
    describe("and the extractType method", function () {
        it("extractType should work", function () {
            var test = "<div cosy-type='test' class='fefefe'>bla allala <p>wefwefwef</p></div>",
                type = parsingHelper.extractType(test);

            type.should.eql("test");
        });
        it("extractType should work", function () {
            var test = "<div cosy-type='test' class='fefefe'>bla allala <p>wefwefwef</p></div>",
                type = parsingHelper.extractType(test);

            type.should.eql("test");
        });
        it("extractType should work", function () {
            var test = "<div class='fefefe'>bla allala <p>wefwefwef</p></div>",
                type = parsingHelper.extractType(test);

            type.should.eql("");
        });
    });
    describe("and the extractPlaceholders method", function () {
        it("extract Place holder should work", function () {
            var test = "<div class='fefefe'>bla allala <p>{{#placeholder toto}}{{/placeholder}}</p>{{#placeholder titit}}{{/placeholder}}</div>",
                placeholders = parsingHelper.extractPlaceholders(test);

            placeholders.length.should.eql(2);
        });
    });
    describe("and the extractComp method", function () {
        it("extract Component should work", function () {
            var test = "<div class='fefefe'>bla allala <p>{{component toto}}</p>",
                component = parsingHelper.extractComp(test);

            component.length.should.eql(1);
        });
        it("extract multiple components should work", function () {
            var test = "<div class='fefefe'>bla allala <p>{{component toto -> model.toto}}</p>{{component titi}}",
                component = parsingHelper.extractComp(test);
            component.length.should.eql(2);
        });
    });
});