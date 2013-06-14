var _ = require("underscore"),
    DOM = require("./DOMBuilder"),
    treeBuilder = require("./treeBuilder"),
    COSYPREFIX = "cosy-",
    BASIC_STRUCTURE = "<div class='" + COSYPREFIX + "root 12 {{row}}'><%=root%></div>";

/**
 * @class GridBuilder
 * @constructor
 * @params {Object} configuration for the grid
 * @returns {Object} Instance of a GridBuilder
 */
var gridBuilder = function (options) {
    options = options || {};

    if (options.prefix && !_.isString(options.prefix)) {
        throw "invalid extraClass";
    }

    if (options.extra && !_.isString(options.extra)) {
        throw "invalid extraClass";
    }

    this.prefix = options.prefix || "";
    this.extra = options.extra || "";
    this.row = options.row || "";
    this.mobilePrefix = options.mobilePrefix || "";
    this.offsetPrefix = options.offsetPrefix || "";
    this.offsetMobilePrefix = options.offsetMobilePrefix || "";
    this.centered = options.centered || "";
    this.mobileCentered = options.mobileCentered || "";

    return this;
};

var buildColumn = function (placeHolder, content, prefix, suffix, mobilePrefix, offsetPrefix, offsetMobilePrefix, centeredClass, mobileCenteredClass) {
    var name = placeHolder.name,
        size = placeHolder.size,
        mobileSize = placeHolder.mobileSize,
        offsetSize = placeHolder.offset,
        offsetMobileSize = placeHolder.offsetMobileSize,
        centered = placeHolder.centered,
        mobileCentered = placeHolder.mobileCentered,
        extra = placeHolder.extra,
        cl = "";

    prefix = prefix || COSYPREFIX;
    suffix = suffix || "";
    mobilePrefix = mobilePrefix || "";
    offsetPrefix = offsetPrefix || "";
    offsetMobilePrefix = offsetMobilePrefix || "";
    centeredClass = centeredClass || "";
    mobileCenteredClass = mobileCenteredClass || "";


    if (!size) {
        size = "";
        prefix = "";
        suffix = "";
    }

    cl = prefix + size;
    if (mobileSize) {
        cl += " " + mobilePrefix + mobileSize;
    }
    if (offsetSize) {
        cl += " " + offsetPrefix + offsetSize;
    }
    if (offsetMobileSize) {
        cl += " " + offsetMobilePrefix + offsetMobileSize;
    }
    if (centered) {
        cl += " " + centeredClass;
    }
    if (mobileCentered) {
        cl += " " + mobileCenteredClass;
    }
    if (extra) {
        cl += " " + extra;
    }
    if (suffix) {
        cl += " " + suffix;
    }

    cl += " " + name;

    return DOM.div(cl, name, "<%=" + name + "%>" + content);
};

var buildColumns = function (columns, content, prefix, suffix) {
    var result = "";

    _.each(columns, function (column) {
        result += buildColumn(column, prefix, suffix);
    }, this);

    return result;
};

var buildPlaceHolder = function (placeHolder, content, prefix, suffix, rowClass, mobilePrefix, offsetPrefix, offsetMobilePrefix, centeredClass, mobileCenteredClass) {
    var placeHolderTemplate,
        name = placeHolder.name;

    if (placeHolder.size) {
        return buildColumn(placeHolder, content, prefix, suffix, mobilePrefix, offsetPrefix, offsetMobilePrefix, centeredClass, mobileCenteredClass);
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
        return BASIC_STRUCTURE.replace("{{row}}", this.row).replace(" '", "'"); //replace regext to trim
    }

    treeBuilder(structure).build(function (placeHolder) {
        var content = "",
            name = placeHolder.name,
            placeHolderContent,
            parent = placeHolder.parent;

        if (dic[name]) {
            content = dic[name];
        }

        placeHolderContent = buildPlaceHolder(placeHolder, content, self.prefix, self.extra, self.row, self.mobilePrefix, self.offsetPrefix, self.offsetMobilePrefix, self.centered, self.mobileCentered);

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