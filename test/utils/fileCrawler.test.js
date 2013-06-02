var fileCrawler = require("../../lib/utils/fileCrawler"),
    should = require("should"),
    path = require("path"),
    STRUCTURE_PATH = path.normalize(__dirname + "../../../content/structures/");

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
        fileCrawler.should.exists;
    });
    it('should be defined when passing componentFolder', function() {
        fileCrawler("/somePath").should.exists;
    });
    it('should have a build method', function() {
        fileCrawler("/somePath").build.should.exists;
    });
    describe('with a existing Path', function() {
        var structureBuilder = fileCrawler(STRUCTURE_PATH);

        it('load', function(done) {
            structureBuilder.build(function (configuration) {
                configuration.length.should.eql(1);
                done();
            });
        });
    });
});