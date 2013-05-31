var should = require("should"),
	_c = require("../../clientLib/cosy");

describe('Given c.js it should work serverside', function() {
    it('should exist', function() {
        _c.should.exists;
    });
    it('should have component function', function() {
        _c.component.should.exists;
    });
    it('should have app function', function() {
        _c.app.should.exists;
    });
});                                                                                                                                                                  