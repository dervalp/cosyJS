var should = require("should"),
	path = require("path"),
	middlewareBuilder = require("../../../lib/core/structure/middlewareBuilder");

describe("Given a middlewareBuilder", function () {
	it("build method should be defined", function () {
		middlewareBuilder.build.should.exist;
	});

	it("should take middleare", function (done) {
		var testMidlePath = path.normalize(__dirname + "/../../data/");

		middlewareBuilder.build(testMidlePath, function (middleware) {
			Object.keys(middleware).length.should.eql(1);
			done();
		});
	});
});