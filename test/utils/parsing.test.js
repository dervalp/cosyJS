var parsingHelper = require("../../lib/utils/parsing"),
    should = require("should");

describe('Given a Parsing Utils', function() {
    it('should be defined', function() {
        parsingHelper.should.exists;
    });
    it('should have a extractType', function() {
        parsingHelper.extractType.should.exists;
    });
    it('extractType should work', function() {
        var test = "<div cosy-type='test' class='fefefe'>bla allala <p>wefwefwef</p></div>",
            type = parsingHelper.extractType(test);
        console.log("solution")
        console.log(type)
        type.should.eql("test");
    });
    it('extractType should work', function() {
        var test = '<div cosy-type="test" class="fefefe">bla allala <p>wefwefwef</p></div>',
            type = parsingHelper.extractType(test);

        type.should.eql("test");
    });
    it('extractType should work', function() {
        var test = '<div class="fefefe">bla allala <p>wefwefwef</p></div>',
            type = parsingHelper.extractType(test);

        type.should.eql("");
    });
});