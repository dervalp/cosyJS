var DOMBuilder = require("../../../lib/core/structure/DOMBuilder"),
    should = require("should");

describe('Given a DOMBuilder', function() {
    it('should be defined', function() {
        DOMBuilder.should.exists;
    });
    it('should have a DIV', function() {
        DOMBuilder.div.should.exists;
    });
    it('execute div should return empty div', function() {
        DOMBuilder.div().should.equal("<div  ></div>")
    });
    it('execute div should return empty div', function() {
        DOMBuilder.p().should.equal("<p ></p>")
    });
     it('execute div should return empty div', function() {
        DOMBuilder.title(1)().should.equal("<h1 ></h1>")
    });
});