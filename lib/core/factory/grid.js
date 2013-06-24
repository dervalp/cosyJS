var gridBuilder = require("../structure/gridBuilder");

module.exports = {
    create: function (type) {
        if (!type) {
            return new gridBuilder();
        }
        if (type === "bootstrap") {
            return new gridBuilder({
                prefix: "span",
                row: "row",
                extra: "",
                offsetPrefix: "offset"
            });
        }
        if (type === "bootstrap-fluid") {
            return new gridBuilder({
                prefix: "span",
                row: "row-fluid",
                extra: "",
                offsetPrefix: "offset"
            });
        }
        if (type === "foundation") {

            return new gridBuilder({
                prefix: "large-",
                row: "row",
                extra: "columns",
                mobilePrefix: "small-",
                offsetPrefix: "large-offset-",
                offsetMobilePrefix: "small-offset-",
                centered: "large-centered",
                mobileCentered: "small-centered",
            });
        }
        throw "invalid type for creating grid";
    }
};