module.exports = {
    extractPlaceholders: function (str) {
        var placholderRegex = new RegExp(/\{\{#placeholder(.*?)\}\}/g),
            matches,
            result = [];

        while (matches = placholderRegex.exec(str)) {
            result.push(matches[1].replace(/^\s+|\s+$/g, ''));
        }

        return result;
    },
    extractType: function (str) {
        var typePatternQuote = new RegExp(/cosy-type="(.*?)"/),
            typePatternSQuote = new RegExp(/cosy-type='(.*?)'/),
            arrMatchesQuote = str.match(typePatternQuote),
            arrMatchesSQuote = str.match(typePatternSQuote);

        if (arrMatchesQuote) {
            return arrMatchesQuote[1];
        }

        if (arrMatchesSQuote) {
            return arrMatchesSQuote[1];
        }

        return "";
    }
};