var search = require("../../utils/search"),
    should = require("should");

var basicStructure = 
{  
    name:     "root",
    size:     "12",
    columns:  [
                {
                  name:     "header",
                  size:     "12",
                  columns:  [
                              { name: "logo", size:"4" },
                              { name: "menu", size:"8" }                            
                            ]
                },
                {
                  name:     "content",
                  size:     "12",
                  columns:  [
                              { name: "navigation", size:"4" },
                              { name: "main", size:"8" }                            
                            ]
                },
                {
                  name:     "footer",
                  size:     "12"
                }
    ]
};

describe('Given a Search Utils', function() {
    it('should be defined', function() {
        search.should.exists;
    });
    it('should have a DFS algorithm', function() {
        search.dfs.should.exists;
    });
     it('dfs should works', function() {
        var result = [];
        
        search.dfs(basicStructure, function(node) {
          result.push(node.name);
        });

        result.length.should.equal(8);
    });
});