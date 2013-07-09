var search = require("./search");

module.exports = {
	flatten: function (tree) {
		var result = [];

		search.dfs(tree, function (node) {
			result.push(node.name);
		});

		return result;
	}
};