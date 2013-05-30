var gridBuilder = require("../../../core/structure/gridBuilder"),
    should = require("should");

describe('Given a gridBuilder', function() {
    it('should be defined', function(done) {
        gridBuilder.should.exists;
        done();
    });
    it('should throw if wrong extencisated', function() {
        (function(){
            new gridBuilder(092, 2092);
        }).should.throw();
    });
    it('should throw if prefix class is wrong', function() {
        (function(){
            new gridBuilder(092);
        }).should.throw();
    });
    it('should throw if extraClass is wrong', function() {
        (function(){
            new gridBuilder("de", 233);
        }).should.throw();
    });
    describe('and an instanciation', function(){
        var basicStructure = {
          name:     "root",
          order:    0,
          columns:[
                    {
                      name:   "header",
                      parent: "root",
                      size:   12,
                      order:  0
                    },
                    {
                      name:   "content",
                      parent: "root",
                      order:  1
                    }
                  ]
        };

        describe('with no parameter passed', function(){
            var grid = new gridBuilder();
            it('should have a create method', function(){
                grid.create.should.exists;
            });
            it('create method should return a real basic structure with no paremter', function(){
                var html = grid.create();
                html.should.equal("<div class='cosy-root 12'><%=root%></div>");
            });
        });
        describe('with no parameter passed', function(){
            var grid = new gridBuilder("span", "", "row");

            it('create method should return header main footer with appropriate parameter', function(){
                var html = grid.create(basicStructure);
                html.should.equal("<div id='cosy-root' class='row'><%=root%><div  class='span12 header'><%=header%></div><div id='cosy-content' class='row'><%=content%></div></div>");
            });
        });
    });
});