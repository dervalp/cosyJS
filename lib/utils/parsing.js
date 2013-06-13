module.exports = {
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