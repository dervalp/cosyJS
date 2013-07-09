var should = require("should"),
	path = require("path"),
	layoutBuilder = require("../../../lib/core/structure/layoutBuilder");

var testPath = path.normalize(__dirname + "/../../data/layouts/");

describe("Given a layoutBuilder", function () {
	it("build method should be defined", function () {
		layoutBuilder.build.should.exist;
	});
	it("build with default parameter", function (done) {
		layoutBuilder.build(function (layouts) {
			Object.keys(layouts).length.should.equal(2);
			done();
		});
	});
	it("build the layout inside a predefined folder", function (done) {
		layoutBuilder.build(testPath, function (layouts) {
			Object.keys(layouts).length.should.equal(3);
			done();
		});
	});
});