module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          "content/stylesheets/menu.css": "content/stylesheets/menu.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  
  grunt.registerTask('default', ['less:dev']);

};