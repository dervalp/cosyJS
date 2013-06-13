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
        next = state,
        push = function (col) {
            queue.push(col);
        };

    if (cb(next)) {
        return;
    }

    while (next) {
        if (next.columns) {
            next.columns.forEach(push);
        }
        next = queue.shift();
    }
};

var buildContent = function (structure) {

    var localStructure = structure;

    if (structure.visited) {
        dfs(localStructure, function (node) {
            delete node.visited;
        });
    }

    var setupNode = function (localStructure) {
        return function (name) {
            var result;
            BFS(localStructure, function (node) {
                if (node.name === name) {
                    result = node;
                }
            });
            return result;
        };
    };

    var findNode = setupNode(localStructure);

    var left = function (node) {

        var parent = findNode(node.parent),
            result;

        if (node.order === 0 || !parent || !parent.columns) {
            return;
        } else {
            parent.columns.forEach(function (col) {
                if (col.order === (node.order - 1)) {
                    result = col;
                }
            });
        }
        return result;
    };

    var right = function (node) {

        var parent = findNode(node.parent),
            result;

        if (!parent || !parent.columns) {
            return;
        } else {
            parent.columns.forEach(function (col) {
                if (col.order === (node.order + 1)) {
                    result = col;
                }
            });

            return result;
        }
    };

    var build = function build(node, visit) {
        if (node === null || node.visited) {
            return;
        }

        if (node.columns) {
            var numChildren = node.columns.length;
            for (var i = 0; i < numChildren; i++) {
                var childNode = node.columns[i];
                build(childNode, visit);
            }
        }

        var leftNode = left(node);
        if (leftNode) {
            build(leftNode, visit);
        }

        visit(node);
        node.visited = true;

        var rightNode = right(node);

        if (rightNode) {
            build(rightNode, visit);
        }
    };

    var setupBuild = function (localStructure) {
        var str = localStructure;
        return function (cb) {
            return build(str, cb);
        };
    };

    return {
        build: setupBuild(localStructure)
    };
};

module.exports = buildContent;