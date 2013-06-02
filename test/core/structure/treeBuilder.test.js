var should = require("should"),
	  treeBuilder = require("../../../lib/core/structure/treeBuilder");

var complexStructure = 
{  
  name:     "root",
  order: 0,
  columns:  [
              {
                name:     "header",
                size:     "12",
                columns:  [
                            { name: "logo", size:"4", parent: "header", order: 0 },
                            { name: "menu", size:"8", parent: "header", order: 1 },
                          ],
                parent: "root",
                order: 0
              },
              {
                name:     "content",
                size:     "12",
                columns:  [
                            { name: "navigation", size:"4", parent: "content", order: 0 },
                            { name: "main", size:"8", parent: "content", order: 1 }                            
                          ],
              	parent: "root",
              	order: 1
              },
              {
                name:     "footer",
                size:     "12",
                columns:  [
                            { name: "footerContent", size:"12", parent: "footer", order: 0 }                            
                          ],
              	parent: "root",
              	order: 2
              }
  ]
};

var complexStructure2 = 
{  
  name:     "root",
  order: 0,
  columns:  [
              {
                name:     "header",
                size:     "12",
                columns:  [
                            { name: "logo", size:"4", parent: "header", order: 0 },
                            { name: "menu", size:"8", parent: "header", order: 1 },
                          ],
                parent: "root",
                order: 0
              },
              {
                name:     "content",
                size:     "12",
                columns:  [
                            { name: "navigation", size:"4", parent: "content", order: 0 },
                            { name: "main", size:"8", parent: "content", order: 1 }                            
                          ],
                parent: "root",
                order: 1
              },
              {
                name:     "footer",
                size:     "12",
                columns:  [
                            { name: "footerContent", size:"12", parent: "footer", order: 0 }                            
                          ],
                parent: "root",
                order: 2
              }
  ]
};

var basicStructure = {
  name: "root",
  order: 0,
  columns: [
    {
      name: "header",
      parent: "root",
      order: 0
    },
    {
      name: "content",
      parent: "root",
      order: 1
    }
  ]
}

describe('Given a Tree Builder', function() {
    it('should work in the correct order for simple structure', function() {
          var result = [];
          var i = 0;

          treeBuilder(basicStructure).build(function(n){
            result.push(n.name);
          });

          result[0].should.equal("header");
          result[1].should.equal("content");
          result[2].should.equal("root");

      });

     it('should work in the correct order for complex structure', function() {
     	var result = [];
     	var i = 0;

      treeBuilder(complexStructure).build(function(n){
        result.push(n.name);
      });

      result[0].should.equal("logo");
      result[1].should.equal("menu");
      result[2].should.equal("header");
      result[3].should.equal("navigation");
      result[4].should.equal("main");
      result[5].should.equal("content");
      result[6].should.equal("footerContent");
      result[7].should.equal("footer");
      result[8].should.equal("root");
    });
    it('should work with same complex structure', function() {
      var result = [];
      var i = 0;
      console.log("LAST TEST")
      treeBuilder(complexStructure).build(function(n){
        result.push(n.name);
      });

      result[0].should.equal("logo");
      result[1].should.equal("menu");
      result[2].should.equal("header");
      result[3].should.equal("navigation");
      result[4].should.equal("main");
      result[5].should.equal("content");
      result[6].should.equal("footerContent");
      result[7].should.equal("footer");
      result[8].should.equal("root");
    });
});