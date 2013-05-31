var should = require("should"),
	_c = require("../../clientLib/cosy"),
    _ = require("underscore"),
    conf = require("../../conf"),
    tmplEngine = require("../../core/template/helper"),
    loader = require("../../core/components/loader")(conf.componentFolder);

_c.setEngine(tmplEngine);

describe('Given a compontent server', function() {
    it('should be able to register the component using cosy in server side', function(done) {
        loader.load("text", _c, function(_c) {
            _.keys(_c.components).length.should.equal(1);
            done();
        });
    });
    it('should be able to register multiple components using cosy in server side', function(done) {
        loader.load(["menu", "image"], _c, function(_c) {
            _.keys(_c.components).length.should.equal(3);
            done();
        });
    });
    it('should not be able to add already existing component', function() {
        (function() { 
            loader.load("menu", _c, function(_c) {
                _.keys(_c.components).length.should.equal(3);
            });
        }).should.throw;
    });
    it('given a text component, it should output', function(done){
        var component = _c.components["text"];

        var model = new component.model({ type: "text",  text: "test" }),
            view = new component.view({ model: model });

        view.render(function(html) {
            console.log("rendering view");
            console.log(html);
            done();
        });
    });
});                                                                                                                           