var _ = require("underscore"),
    DOM = require("./DOMBuilder"),
    dfs = require("../../utils/search").dfs,
    treeBuilder = require("./treeBuilder");

module.exports = function(cosyPrefix) {
    BASIC_STRUCTURE = "<div class='" + cosyPrefix + "root 12 {{row}}'><%=root%></div>";
    /**
     * CTOR
     * The purpose of the gridBuilder is to create the HTLM structure for a website
     * Some default structure will be provided by cosy
     * @params {String} "span" for Boostrap, "-large" for "Foundation"
     * @params {String} extra class you sometimes need "columns" for Foundation.
     */
    var gridBuilder = function(prefixClass, extraClass, classForRow) {     
        if(prefixClass && !_.isString(prefixClass)) {
            throw "invalid extraClass";
        }
        
        if(extraClass && !_.isString(extraClass)) {
            throw "invalid extraClass";
        }
        
        this.prefixClass = prefixClass || "";
        this.extraClass = extraClass || "";
        this.rowClass = classForRow || "";
    };

    /**
     * Create the HTML for the strcture
     * @params {Object}
     *[
     * { name: "header", columns: [
     *                              { name: "Logo", size:"4" },
     *                              { name: "Menu", size:"8" }                            
     *                            ]
     * },
     * { name: "content", columns: [
     *                              { name: "Navigation", size:"4" },
     *                              { name: "Main", size:"8" }                            
     *                            ]
     * },
     * { name: "footer", columns: [
     *                              { name: "Footer", size:"12" }                            
     *                            ]
     * }
     *]
     */
    gridBuilder.prototype.create = function(structure) {
        var result = "",
            builder = treeBuilder(structure),
            dic = {},
            self = this;

        if(!structure || _.keys(structure).length === 0) {
            return BASIC_STRUCTURE.replace("{{row}}", this.rowClass).replace(" '", "'"); //replace regext to trim
        }


        builder.build(function(placeHolder) {
            var content = "",
                name = placeHolder.name,
                placeHolderContent,
                parent = placeHolder.parent;

            if(dic[name]) {
                content = dic[name];
            }

            placeHolderContent = buildPlaceHolder(placeHolder, content, self.prefixClass, self.extraClass, self.rowClass);

            if(parent && !dic[parent]) {
                dic[parent] = placeHolderContent
            } else if(parent && dic[parent]) {
                dic[parent] += placeHolderContent;
            } else {
                result += placeHolderContent;
            }
        });

        return result;
    };

    var buildColumn = function(placeHolder, content, prefix, suffix) {
        var name = placeHolder.name,
            size = placeHolder.size,
            prefix = prefix || cosyPrefix,
            suffix = suffix || "",
            cl = "";

            if(!size) {
                size = "";
                prefix = "";
                suffix = "";
            }

            cl = prefix + size + suffix + " " + name;
        
        return DOM.div(cl, "", "<%=" + name + "%>" + content);
    };

    var buildColumns = function(columns, content, prefix, suffix) {
        var result = "";

        _.each(columns, function(column){
            result += buildColumn(column, prefix, suffix);
        }, this);

        return result;
    };

    var buildPlaceHolder = function(placeHolder, content, prefix, suffix, rowClass) {
        var name = placeHolder.name,
            content;

        if(placeHolder.size) {
            return buildColumn(placeHolder, content, prefix, suffix);
        } else {
            var placeHolder = "<%="+ placeHolder.name +"%>";
            return DOM.div(rowClass, name, placeHolder + content).trim();
        }
    };
}