var should = require("should"),
	path = require("path"),
	controllerBuilder = require("../../../lib/core/structure/controllerBuilder"),
	testPath = path.normalize(__dirname + "/../../data/controllers/");

describe("Given a controllerBuilder", function () {
	it("build method should be defined", function () {
		controllerBuilder.build.should.exist;
	});

	it("should take middleare", function (done) {
		controllerBuilder.build(testPath, function (controllers) {
			Object.keys(controllers).length.should.eql(1);
			done();
		});
	});
});