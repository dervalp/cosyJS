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
        var cosyApp = cosy(fakeExpress);

        it('should have a start function', function() {          
            cosyApp.start.should.exists;
        });
        it('should start server when calling start', function(done) {          
            cosyApp.start(function() {
                done();
            });
        });
    });     
});