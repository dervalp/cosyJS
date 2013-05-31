var express = require('express'),
	path = require('path'),
    http = require('http'),
	app = express(),
	cosy = require('./index')(app);

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

  cosy.start(function(){
  	http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
  });
