module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          "content/stylesheets/menu.css": "content/stylesheets/menu.less"
        }
      }
    },
    jshint: {
      all: ["Gruntfile.js", "lib/**/*.js", "test/**/*.js"],
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        quotmark: "double",
        noarg: true,
        forin: true,
        newcap: true,
        sub: true,
        undef: false,
        boss: true,
        strict: false,
        eqnull: true,
        node: true,
        maxcomplexity: 6,
        browser: true,
        expr: "warn"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("default", ["jshint"]);

};