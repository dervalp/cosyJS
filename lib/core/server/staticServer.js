/**
 * staticServer register the root in order to server all the component within a page
 */
module.exports = function(scriptBuilder) {
    var cache = {};

    return {
        configure: function(app, configuration) {
            var configuration = configuration;

            app.get("/load/comp", function(req, res) {
                var param = req.query["mod"],
                    params = param.substring( 1, (param.length - 1) ).split(",");

                if(cache[param]) {
                    return res.send(cache[param]);
                } else {
                    scriptBuilder.build(params, configuration, function(file) {
                        cache[param] = file;
                        return res.send(file);
                    });
                }
            });
        }
    };
};