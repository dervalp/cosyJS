/**
 * staticServer register the root in order to server all the component within a page
 */
module.exports = function(scriptBuilder) {
    return {
        configure: function(app) {
            app.get("/load/comp", function(req, res) {
                var param = req.query["mod"],
                    params = param.substring( 1, (param.length - 1) ).split(",");

                scriptBuilder.build(params, function(file){
                  res.send(file);
                });
            });
        }
    };
};