/*
 * inorder(node)
 *   if node == null then return
 *   inorder(node.left)
 *   visit(node)
 *   inorder(node.right)
 */
var dfs = require("../../utils/search").dfs;

var BFS = function (state, cb) {
      var queue = [],
          next = state;
          if(cb(next))
            return
      while (next) {
          if (next.columns) {
              next.columns.forEach(function(column) {
                  queue.push(column);
              });
          }
          next = queue.shift();
      }
};

var buildContent = function(structure) {

  var localStructure = structure;

  if(structure.visited) {
    dfs(localStructure, function(node) {
      delete node.visited;
    });    
  };

  var setupNode = function(localStructure) {
    return function(name) {
      var result;
      BFS(localStructure, function(node) {
        if(node.name === name) {
          result = node;
        }
      });
      return result;
    }
  };

  var findNode = setupNode(localStructure);

  var left = function(node) {

    var parent = findNode(node.parent),
      result;

    if(node.order === 0 || !parent || !parent.columns) {
      return
    } else {
      parent.columns.forEach(function(col){
        if(col.order === (node.order - 1)) {
          result = col;
        }
      });
    }
    return result;
  }

  var right = function(node) {

    var parent = findNode(node.parent),
        result;

    if(!parent || !parent.columns) {
      return
    } else {
      parent.columns.forEach(function(col){
        if(col.order === (node.order + 1)) {
          result = col;
        }
      });
      
      return result;
    }
  }

  var build = function build(node, visit) {
      if(node === null || node.visited) {
        return
      }
          
      //console.log("1 - buildContent for node " + node.name);

      if(node.columns) {
        //console.log("2 - buildContent for the child first " + node.name);
        var numChildren = node.columns.length;  
        for (var i = 0; i < numChildren; i++) {
          var childNode = node.columns[i];
          build(childNode, visit);
        }
      }

      //console.log("I am a leaf");

      var leftNode = left(node);
      if(leftNode) {
        //console.log("My left node is " + leftNode.name);
        build(leftNode, visit);  
      }

      visit(node);
      node.visited = true;

      var rightNode = right(node);
      if(rightNode) {
        //console.log("My right node is " + rightNode.name);
        build(rightNode, visit);
      }
  };

  var setupBuild = function(localStructure) {
    var str = localStructure;
    return function(cb) {
      return build(str, cb);
    }
  };

  return {
    build: setupBuild(localStructure)
  }
};

module.exports = buildContent;