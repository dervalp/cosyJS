/* jshint quotmark: false */

var should = require("should"),
    Backbone = require("backbone"),
    path = require("path"),
    _c = require("../../clientLib/cosy");


describe("Given a cosy Component", function () {
    var basicComponent = "testComponent",
        placeholderComponent = "placeholderComponent",
        nestedComponent = "nestedComponent";

    beforeEach(function(){
        //set the Template Engine to Server Side.
        var tmplSystem = require("../../lib/core/template/helper"),
            fakeComponentsFolder = path.normalize(process.cwd() + "/test/data/components/");

        _c.setEngine( tmplSystem( fakeComponentsFolder ) );
    });

    describe("should be able to create a basic Component", function () {
        _c.component({
            name: basicComponent,
            type: basicComponent
        });

        it("should be under _c.components", function() {
            _c.components.should.exists;
        });

        it("should have a model and a view", function() {
            _c.components[basicComponent].model.should.exists;
            _c.components[basicComponent].view.should.exists;
        });
        describe("and when we create a control based on this basic component", function () {
            //force component to act as a custom component
            _c.components[basicComponent].isInstance = true;

            var control = _c.expose({
                id: "test",
                key: "test",
                type: basicComponent
            }, {
                id: "test",
                type: basicComponent
            });

            it("should exist", function() {
                control.should.exist;
            });
            it("should have a model", function() {
                control.model.should.exist;
            });
            it("should have a view", function() {
                control.view.should.exist;
            });
            it("should have a render method", function() {
                control.view.render.should.exist;
            });
            it("should give some html and an empty json when it is rendered", function(done) {
                control.view.render(function(result, json) {
                    result.should.equal('<div cosy-type="testComponent" cosy-id="test"></div>');
                    json.should.exist;
                    json.length.should.equal(0);

                    done();
                });
            });
        });
    });
    describe("should be able to create a placeholderComponent Component", function () {
        _c.component({
            name: placeholderComponent,
            type: placeholderComponent
        });

        it("should have a model and a view", function() {
            _c.components[placeholderComponent].model.should.exists;
            _c.components[placeholderComponent].view.should.exists;
        });
        describe("and when we create a control based on this basic component", function () {
            //force component to act as a custom component
            _c.components[placeholderComponent].isInstance = true;

            var control = _c.expose({
                id: "testPlacholder",
                key: "testPlacholder",
                type: placeholderComponent
            }, {
                id: "testPlacholder",
                type: placeholderComponent,
                test: "test"
            });

            it("should exist", function() {
                control.should.exist;
            });
            it("should have a model", function() {
                control.model.should.exist;
            });
            it("should have a view", function() {
                control.view.should.exist;
            });
            it("should have a render method", function() {
                control.view.render.should.exist;
            });
            it("should give some html and an empty json when it is rendered", function(done) {
                control.view.render(function(result, json) {
                    result.should.equal('<div cosy-type="placeholderComponent" cosy-id="testPlacholder">test</div>');
                    json.should.exist;
                    json.length.should.equal(0);

                    done();
                });
            });
        });
    });
    describe("should be able to create a nestedComponent", function () {
        _c.component({
            name: nestedComponent,
            type: nestedComponent
        });

        it("should have a model and a view", function() {
            _c.components[nestedComponent].model.should.exists;
            _c.components[nestedComponent].view.should.exists;
        });
        describe("and when we create a control based on this basic component", function () {
            //force component to act as a custom component
            _c.components[nestedComponent].isInstance = true;

            var control = _c.expose({
                id: "testNestedComponent",
                key: "testNestedComponent",
                type: nestedComponent
            }, {
                id: "testNestedComponent",
                type: nestedComponent,
                test: "testNestedComponent"
            });

            it("should exist", function() {
                control.should.exist;
            });
            it("should have a model", function() {
                control.model.should.exist;
            });
            it("should have a view", function() {
                control.view.should.exist;
            });
            it("should have a render method", function() {
                control.view.render.should.exist;
            });
            it("should give some html and an empty json when it is rendered", function(done) {
                control.view.render(function(result, json) {

                    result.should.equal('<div cosy-type="nestedComponent" cosy-id="testNestedComponent"><div cosy-type="testComponent" cosy-id="nested_1"></div></div>');
                    json.should.exist;

                    //right now all subcomp are dynamic
                    json.length.should.equal(1);

                    done();
                });
            });
        });
    });
});