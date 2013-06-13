 var fs = require("fs"),
     events = require("events"),
     jade = require("jade"),
     data = {};

 var layoutBuilder = function (layoutBuilder) {
     this.layoutBuilder = layoutBuilder;
     events.EventEmitter.call(this);
     this.build();
 };
 // inherit events.EventEmitter
 layoutBuilder.super_ = events.EventEmitter;
 layoutBuilder.prototype = Object.create(events.EventEmitter.prototype, {
     constructor: {
         value: layoutBuilder,
         enumerable: false
     }
 });

 layoutBuilder.prototype.build = function () {
     var self = this;
     fs.readdir(self.layoutBuilder, function (err, files) {
         if (err) {
             throw err;
         }
         var c = 0;

         files.forEach(function (file) {
             c++;
             fs.readFile(conf.layoutFolder + file, "utf-8", function (err, html) {
                 if (err) {
                     throw err;
                 }
                 data[file] = jade.compile(html, {
                     filename: self.layoutBuilder + file,
                     pretty: false
                 });
                 if (0 === --c) {
                     self.emit("ready", data);
                 }
             });
         });
     });
 };

 module.exports = function (layoutBuilder) {
     return new layoutBuilder(layoutBuilder);
 };