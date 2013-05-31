var should = require("should"),
    scriptBuilder = require("../../../core/structure/scriptBuilder");

describe('Given a ScriptBuilder', function() {
    it('build method should be defined', function() {
        scriptBuilder.build.should.exist;
    });
    it('should be able to build component', function(done) {
        var test = ["text"];

        scriptBuilder.build(test, function(result){
            console.log(result);

            done();
        });
    });
});