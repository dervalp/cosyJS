var cosy = require("../lib/cosy"),
    should = require("should");

var fakeExpress = {
    get: function() {}
};

describe('Given Cosy', function() {
    it('should be defined', function() {
        cosy.should.exists;
    });
    describe('and a fake express instance', function() {
        it('should be defined', function() {          
            var cosyApp = cosy(fakeExpress);
        });
    });
    describe('and a fake express instance', function() {
        it('should be defined', function() {          
            var cosyApp = cosy(fakeExpress);
            cosyApp.start.should.exists;
        });
    });     
});