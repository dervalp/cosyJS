var should = require("should"),
    structureBuilder = require("../../../lib/core/structure/structureBuilder");

describe('Given a StructureBuilder', function() {
    it('build method should be defined', function() {
        structureBuilder.should.exist;
    });
    it('should be able to build component', function() {
        structureBuilder.build.should.exist;
    });
    it('should be able to build component', function(done) {
        structureBuilder.build(function(structures){
            structures.length.should.equal(1);
            done();
        });
    });
});