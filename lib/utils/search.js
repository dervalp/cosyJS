var dfs = function (rootNode, visitorFunc) {
    var numChildren = rootNode.columns ? rootNode.columns.length : 0;
    
    visitorFunc(rootNode);
    for (var i = 0; i < numChildren; i++) {
        var childNode = rootNode.columns[i];
        dfs(childNode, visitorFunc);
    }
};

module.exports = {
    dfs: dfs
};