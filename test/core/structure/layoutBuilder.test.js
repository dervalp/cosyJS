var layoutBuilder = require("../../../lib/core/structure/layoutBuilder"),
	should = require("should");

describe('Given a layoutBuilder', function() {
	it('should have data in the layout', function(done) {
		var layout = layoutBuilder().on('ready', function(data) {
			//defaults
			var html = data["layout.master.jade"]();
			html.should.equal("<!DOCTYPE html><html><head><title> </title></head><body><%=content%></body></html>");
			done()
		});		
	});
});