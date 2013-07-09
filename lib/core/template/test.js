tmplSystem.registerHelper("component", function (name, object) {
	//assume the _c is present

	if (art.city) {
		var url = "//" + art.city.shortName + "." + all.domain + "/";
		return new tmplSystem.SafeString("<a href='" + url + "'><span>" + art.city.name + "</span></a>");
	} else {
		return new tmplSystem.SafeString("<span>" + art.address + "</span>");
	}
});