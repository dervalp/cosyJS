var _ = require("underscore"),
    DOM = require("./DOMBuilder"),
    treeBuilder = require("./treeBuilder"),
    COSYPREFIX = "cosy-",
    BASIC_STRUCTURE = "<div class='" + COSYPREFIX + "root 12 {{row}}'>{{content}}</div>";

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

    this.configuration = {};
    this.configuration.prefix = options.prefix || "";
    this.configuration.extra = options.extra || "";
    this.configuration.row = options.row || "";
    this.configuration.mobilePrefix = options.mobilePrefix || "";
    this.configuration.offsetPrefix = options.offsetPrefix || "";
    this.configuration.offsetMobilePrefix = options.offsetMobilePrefix || "";
    this.configuration.centered = options.centered || "";
    this.configuration.mobileCentered = options.mobileCentered || "";

    return this;
};

var buildColumn = function (placeHolder, content, configuration) {
    var name = placeHolder.name,
        size = placeHolder.size,
        mobileSize = placeHolder.mobileSize,
        offsetSize = placeHolder.offset,
        offsetMobileSize = placeHolder.offsetMobileSize,
        centered = placeHolder.centered,
        mobileCentered = placeHolder.mobileCentered,
        extra = placeHolder.extra || "",
        prefix = configuration.prefix,
        suffix = configuration.extra,
        cl = "";

    prefix = prefix || COSYPREFIX;

    if (!size) {
        size = "";
        prefix = "";
        suffix = "";
    }

    cl = prefix + size;
    if (mobileSize) {
        cl += " " + configuration.mobilePrefix + mobileSize;
    }
    if (offsetSize) {
        cl += " " + configuration.offsetPrefix + offsetSize;
    }
    if (offsetMobileSize) {
        cl += " " + configuration.offsetMobilePrefix + offsetMobileSize;
    }
    if (centered) {
        cl += " " + configuration.centered;
    }
    if (mobileCentered) {
        cl += " " + configuration.mobileCentered;
    }
    if (extra) {
        cl += " " + extra;
    }
    if (suffix) {
        cl += " " + suffix;
    }

    cl += " " + name;

    return DOM.div(cl, name, "{{" + name + "}}" + content);
};

var buildPlaceHolder = function (placeHolder, content, configuration) {
    var placeHolderTemplate,
        name = placeHolder.name;

    if (placeHolder.size) {
        return buildColumn(placeHolder, content, configuration);
    } else {
        placeHolderTemplate = "{{" + placeHolder.name + "}}";
        return DOM.div(configuration.row, name, placeHolderTemplate + content).trim();
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
        return BASIC_STRUCTURE.replace("{{row}}", this.configuration.row).replace(" '", "'"); //replace regext to trim
    }

    treeBuilder(structure).build(function (placeHolder) {
        var content = "",
            name = placeHolder.name,
            placeHolderContent,
            parent = placeHolder.parent;

        if (dic[name]) {
            content = dic[name];
        }

        placeHolderContent = buildPlaceHolder(placeHolder, content, self.configuration);

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