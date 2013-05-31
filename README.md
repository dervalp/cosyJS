cosyJS
======

Full stack UI component library and layout generator

## Intro

The idea is to provide you out of the box a node.js server which manage all your static files (stylesheets, javascript templates, javascript lib,...).

cosyJS has also some nice features out of the box like:

* A layout generator using Bootstrap (and later Foundation and Cosy Grid Stystem)
* A powerfull client-side library which allows you to play easily with your HTML and/or the cosyJS components. 
* A library of full-stack components which has a set of UI element you use all the time (text, button, image).

## Shared Templates

The idea behind cosy is to shared the Templates you use to render your data between client-side and server-side. cosyJS expect an Express (or at least connect) server.

## Work in progress

This is still currenly in development but you are free to collaborate on the project.

Here is a list of task you could do:

* Create new full-stack components
* Improve performance
* Share your opinions and comments

##Roll your own

Right now Cosy required an express instance in order to work, here is the code to add Cosy to your existing express instance.

```javascript
  var express = require('express'),
      http = require('http'),
	  app = express(),
	  cosy = require('cosy')(app);

  cosy.start(function(){
  	http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
  });
```
##The Component

By using node.js we are able to run the same code client and server side and cosy tries to take this to its advantage and allows you to share lots of code client and server side.

A component needs 2 things in order to work, the definition and the template.

**The definition**

It is there where you will put the logic of your component. This component is a wrapper for a Backbone.Model anb a Backbone.View. So you can use all the backbone syntax in it.

A basic component definion:

```javascript
_c.component({
    name: "basicComponent",
    events: {
    	"click .someClass": "doSomething"
    },
    doSomething: function() {
    	alert("hello world")
	}
});
```

**The template**

The template uses handlbar (client/server) syntax to produce the HTML.

Here is a template for the "basicComponent" above:

```html
<div>
  <button class="someClass">Do Something</button>
</div>
```
