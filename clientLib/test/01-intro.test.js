var should = require("should"),
	_ = require("underscore"),
	_c = require("../01-intro")

describe('Given Cosy Client Side Libray', function() {
    it('should exist', function() {
    	_c.should.exist;
    });
    it('should have version exist', function() {
    	_c.version.should.exist;
    	_c.version.should.equal("0.0.1");
    });
    it('should have an app method', function() {
    	_c.app.should.exist;
    	_.isFunction(_c.app).should.equal(true);
    });
    it('should be able to create an app', function() {

    	var app = _c.app("name");
    	app.should.exist;
    	app.module.should.exist;
    	app.modules.length.should.equal(0);
    });
    it('should be able to create an app and a module', function() {
    	var app = _c.app("name")
    	var module = app.module("test");
		app.test.should.exist;
    	app.modules.length.should.equal(1);
    	app.test.should.exist;
    });
    it('should be able to create an app and a module and add a component to the module', function() {
    	var component = _c.component();
    	var module = _c.app("name").module("test");
    	module.add("test", component);
    	module.should.exist;
    	module.test.should.exist;
    });
});