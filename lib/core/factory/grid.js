module.exports = {
	create: function(type) {
		if(!type) {
			return new gridBuilder();
		}
		if(type === "bootstrap") {
			return new gridBuilder("span", "", "row");
		}
		if(type === "bootstrap-fluid") {
			return new gridBuilder("span", "", "row-fluid");
		}
		throw "invalid type for creating grid"
	}
}