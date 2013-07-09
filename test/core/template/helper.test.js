var should = require("should"),
    path = require("path"),
    componentFolder = path.normalize(__dirname + "/../../data/templates/"),
    templateHelper = require("../../../lib/core/template/helper")(componentFolder);

describe("Given a templateHelper", function () {
    it("should be defined", function () {
        templateHelper.should.exist;
    });
    it("get method should be defined", function () {
        templateHelper.get.should.exist;
    });
    it("should be able to fetch test template", function (done) {
        templateHelper.get("test", true, function (content) {
            content.should.equal("test");
            done();
        });
    });
});