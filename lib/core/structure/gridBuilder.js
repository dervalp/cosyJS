var _ = require("underscore"),
    DOM = require("./DOMBuilder"),
    treeBuilder = require("./treeBuilder"),
    COSYPREFIX = "cosy-",
    BASIC_STRUCTURE = "<div class='" + COSYPREFIX + "root 12 {{row}}'><%=root%></div>";

/**
 * @class GridBuilder
 * @constructor
 * @params {String} string will be added before the column class. Ex: bootstrap uses span
 * @params {String} string will be added after the column class.
 * @params {String} css class for a row.
 * @returns {Object} Instance of a GridBuilder
 */
var gridBuilder = function (prefixClass, extraClass, classForRow) {
    if (prefixClass && !_.isString(prefixClass)) {
        throw "invalid extraClass";
    }

    if (extraClass && !_.isString(extraClass)) {
        throw "invalid extraClass";
    }

    this.prefixClass = prefixClass || "";
    this.extraClass = extraClass || "";
    this.rowClass = classForRow || "";

    return this;
};

var buildColumn = function (placeHolder, content, prefix, suffix) {
    var name = placeHolder.name,
        size = placeHolder.size,
        cl = "";

    prefix = prefix || COSYPREFIX;
    suffix = suffix || "";

    if (!size) {
        size = "";
        prefix = "";
        suffix = "";
    }

    cl = prefix + size + suffix + " " + name;

    return DOM.div(cl, name, "<%=" + name + "%>" + content);
};

var buildColumns = function (columns, content, prefix, suffix) {
    var result = "";

    _.each(columns, function (column) {
        result += buildColumn(column, prefix, suffix);
    }, this);

    return result;
};

var buildPlaceHolder = function (placeHolder, content, prefix, suffix, rowClass) {
    var placeHolderTemplate,
        name = placeHolder.name;

    if (placeHolder.size) {
        return buildColumn(placeHolder, content, prefix, suffix);
    } else {
        placeHolderTemplate = "<%=" + placeHolder.name + "%>";
        return DOM.div(rowClass, name, placeHolderTemplate + content).trim();
    }
};

/**
 * Create the grid based on a structure
 *
 * @method create
 * @params {Object} a JSON object representing a grid structure
 * @returns {String} HTML representation of the grid
 */
gridBuilder.prototype.create = function (structure) {
    var result = "",
        dic = {},
        self = this;

    if (!structure || _.keys(structure).length === 0) {
        return BASIC_STRUCTURE.replace("{{row}}", this.rowClass).replace(" '", "'"); //replace regext to trim
    }

    treeBuilder(structure).build(function (placeHolder) {
        var content = "",
            name = placeHolder.name,
            placeHolderContent,
            parent = placeHolder.parent;

        if (dic[name]) {
            content = dic[name];
        }

        placeHolderContent = buildPlaceHolder(placeHolder, content, self.prefixClass, self.extraClass, self.rowClass);

        if (parent && !dic[parent]) {
            dic[parent] = placeHolderContent;
        } else if (parent && dic[parent]) {
            dic[parent] += placeHolderContent;
        } else {
            result += placeHolderContent;
        }
    });

    return result;
};

module.exports = gridBuilder;