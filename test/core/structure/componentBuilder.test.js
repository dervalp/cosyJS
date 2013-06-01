var componentBuilder = require("../../../lib/core/structure/componentBuilder"),
    should = require("should");

var _c = function() {
    var comp = [];
    return {
        component: function (obj) {
            comp.push(obj);
        },
        comp: comp
    };
}();

describe('Given a componetBuilder', function() {
    it('should be defined', function() {
        componentBuilder.should.exists;
    });
    it('should be defined when passing componentFolder', function() {
        componentBuilder("/somePath").should.exists;
    });
    it('should have a build method', function() {
        componentBuilder("/somePath").build.should.exists;
    });
    describe('with a existing Path', function() {
        var compBuilder = componentBuilder("content/components/");
        it('load', function(done) {
            compBuilder.build(_c, function (_c) {
                _c.comp.length.should.eql(5);
                done();
            });
        });
    });
});