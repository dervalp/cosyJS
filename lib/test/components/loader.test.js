var browserify = require("browserify"),
    should = require("should");

describe('Given browserify', function() {
    it('should be able to load a content', function(done) {
        var b = browserify();
        b.add("./content/components/modal.js");
        b.add("./content/components/popover.js");
        b.bundle(function(err, doc){
            console.log("error");
            console.log(err);
            console.log("doc");
            console.log(doc);
            done();
        });
    });
});