/**
 * Node's modules
 */
var express = require('express'),
    path = require('path'),
    http = require('http');

/**
 * Configuration's module, should come from database
 */
var conf = require("./conf"),
    testingData = require("./data");

/**
 * Cosy's modules
 */
var _c = require("./clientLib/cosy"),
    scriptBuilder = require('./core/structure/scriptBuilder'),
    applicationServer = require("./core/server/applicationServer"),
    staticServer = require("./core/server/staticServer"),
    builderServer = require("./core/server/builderServer"),
    tmplEngine = require("./core/template/helper"),
    componentBuilder = require("./core/structure/componentBuilder")(conf);

var app = express();
    
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/content/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'content/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

staticServer.configure(app);

_c.setEngine(tmplEngine);

/* should come from database or internal memory */
var components = ["text", "image", "menu", "button",  "collapse"];

/*should be move to other module*/
componentBuilder.build(components, _c, function(_c) {

    applicationServer.configure(app, _c, testingData);
    
    builderServer.configure(app, _c, testingData);

    http.createServer(app).listen(app.get('port'), function() {
      console.log("Express server listening on port " + app.get('port'));
    });
});