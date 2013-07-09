var merger = require("../../lib/utils/merger"),
    should = require("should"),
    path = require("path"),
    testPath = path.normalize(__dirname + "/../../test/data/pages");

var pageTest = {
    "name": "about",
    "subdomain": "www",
    "route": "/about",
    "layout": "market",
    "middlewares": [
            "config",
            "scope"
    ],
    "structure": "marketing",
    "components": [{
            "type": "extend",
            "name": "main"
        }, {
            "type": "about",
            "id": "about",
            "dynamic": false,
            "placeholder": "contentMain"
        }, {
            "type": "staticMenu",
            "id": "staticMenu",
            "dynamic": false,
            "placeholder": "contentSidebar",
            "data": {
                "selected": "about"
            }
        }
    ]
};

describe("Given a merge", function () {
    it("should be defined", function () {
        merger.should.exists;
    });
    it("should be defined", function () {
        merger.extendPage.should.exists;
    });
    it("should be defined", function (done) {
        var count = pageTest.components.length;

        merger.extendPage(pageTest, testPath, function (page) {
            page.components.length.should.equal((count++));
            done();
        });
    });
});