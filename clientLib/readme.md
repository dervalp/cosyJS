#Core.js Verison

##Core

The core has 3 main methods:

- run() This method is used to scope you application in an html page. It will return an app objects.

- component() The core is provided with no component by default but you could add them "on the fly" and it will be available in the whole framework.
You need to pass a view, a model and an element in order to create a component. (more info later on this).

- resolve() which helps you to execute javascript code (usefull when you want to set behavior which comes from the server).

##Model and View

Model, View are based on backbone.js.

Before using our model and view, you should have a look to this documentation:

Backbone's website: http://backbonejs.org/
A free book talking about backbone: https://github.com/addyosmani/backbone-fundamentals/blob/gh-pages/index.md
A real life application with the annoted source: http://backbonejs.org/docs/todos.html

If you use the Sitecore.Model, by default all the attributes will be 2-way binded.

We use knock-out to support the binding: http://knockoutjs.com/

##Pipelines and Converters

Mainly coded by sitecore.

Converters allow you to convert a field to html code (and vice-versa).

Pipelines allow you to hook in the process of an execution (ajax call, server click,...) in order to add behavior on it.

##Item

Item is a model which help you to manipulates items in client side. It also enable you to make ajax call from sitecore's server.

An Item is a specialized version of the backbone model (the sync version has been ovveriden to support this).

##Helpers

A bunch of static methods we used and you could used to ease your development




