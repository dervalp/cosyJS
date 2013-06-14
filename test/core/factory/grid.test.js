var gridFactory = require("../../../lib/core/factory/grid"),
    should = require("should");

describe("Given a grid factory", function () {
    it("should be defined", function () {
        gridFactory.should.exists;
    });
    it("should have a build method", function () {
        gridFactory.create.should.exists;
    });
    it("should throw with invalid type", function () {
        (function () {
            gridFactory.create("toto");
        }).should.
        throw ();
    });
    it("should be able to create default grid", function () {
        var defaultGrid = gridFactory.create();
        defaultGrid.should.exists;
        defaultGrid.create.should.exists;
    });
    it("should be able to create bootstrap grid", function () {
        var bootstrapGrid = gridFactory.create("bootstrap");
        bootstrapGrid.should.exists;
        bootstrapGrid.create.should.exists;
    });
    it("should be able to create bootstrap grid", function () {
        var bootstrapFluidGrid = gridFactory.create("bootstrap-fluid");
        bootstrapFluidGrid.should.exists;
        bootstrapFluidGrid.create.should.exists;
    });
    it("should be able to create bootstrap grid", function () {
        var foundation = gridFactory.create("foundation");
        foundation.should.exists;
        foundation.create.should.exists;
    });
});