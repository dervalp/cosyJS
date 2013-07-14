module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          "content/stylesheets/menu.css": "content/stylesheets/menu.less"
        }
      }
    },
    watch: {
      scripts: {
        files: ["/lib/**/*.js"],
        tasks: ["jshint", "shell"],
        options: {
          livereload: true
        },
      },
    },
    shell: {
      test: {
        command: "npm test",
        options: {
          async: false
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
        unused: false,
        eqnull: true,
        node: true,
        browser: true,
        expr: "warn"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-shell-spawn");

  grunt.registerTask("default", ["jshint", "shell"]);
  grunt.registerTask("dev", ["watch"]);

};