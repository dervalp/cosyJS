module.exports = function(grunt)
{
  // Project configuration.
  grunt.initConfig({
   
   
  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
/*, 'uglify:dist', 'copy:dist', 'concat:oneFile', 'uglify:oneFile']*/
  grunt.registerTask('default', ['concat:dist', 'uglify:dist', 'copy:dist', 'concat:oneFile', 'uglify:oneFile']);
  //grunt.registerTask('generate', 'concat min copy:dist jasmine copy:solution');
};