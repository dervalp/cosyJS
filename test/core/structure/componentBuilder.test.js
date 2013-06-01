var componentBuilder = require("../../../lib/core/structure/componentBuilder"),
    should = require("should");

describe('Given a componetBuilder', function() {
    it('should be defined', function() {
        componentBuilder.should.exists;
    });
});