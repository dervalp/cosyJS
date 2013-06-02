bootstrap allows you to create a new node.js app with a few things already setup to get you started. It takes a lot of inspiration from the express app executable.

You can use Javascript or Coffescript by following the prompts.

## Usage

    $ npm install -g bootstrap
    $ bootstrap yourappname
    $ cd yourappname
    $ npm install

If you are using Heroku and Foreman you can now do

    $ foreman start

If you want to start it with node you can do

    $ node app.js

If you are using CoffeeScript then you can do

    $ coffee app.coffee

TODO:

* Add support for .scss
* Add support for Mustache and Icanhaz.js templates
