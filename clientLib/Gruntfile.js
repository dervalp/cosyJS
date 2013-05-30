module.exports = function(grunt)
{
  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '1.0.2',
      name: 'SPEAK.js'
    },
    concat: {
      dist: {
        dest: 'dist/<%= meta.version %>/sitecore-<%= meta.version %>.js',
        src: [
          '0100 - intro.js',
          '0200 - backbone.js',
          '0300 - core.js',
          '0310 - loader.js',
          '0320 - commands.js',
          '0350 - factories.js',
          '0400 - models.js',
          '0450 - views.js',
          '0500 - helper.js',
          '0600 - converters.js',
          '0700 - pipelines.js',
          '0750 - pipelines-application.js',
          '0900 - itemwebapi.js',
          '1000 - layoutManager.js',
          '2000 - uris.js',
          '2500 - databases.js',
          '3000 - fields.js',
          '4000 - localStorage.js',
          '3500 - items.js',
          '8000 - jqueryuicomponent.js',
          '9999 - outro.js'
        ]
      },
      oneFile: {
        src: [
          'vendors/underscore/underscore.1.4.4.min.js',
          'vendors/backbone/backbone.0.9.10.min.js',
          'vendors/ko/knockout-2.2.1.min.js',
          'vendors/localstorage/jsStorage.0.3.2.min.js',
          'dist/<%= meta.version %>/sitecore-<%= meta.version %>.min.js',
        ],
        dest: 'dist/<%= meta.version %>/sitecore-<%= meta.version %>.packed.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= meta.name %>, <%= meta.version %> - generated on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['dist/<%= meta.version %>/sitecore-<%= meta.version %>.js'],
        dest: 'dist/<%= meta.version %>/sitecore-<%= meta.version %>.min.js'
      },
      oneFile: {
        src: ['dist/<%= meta.version %>/sitecore-<%= meta.version %>.packed.js'],
        dest: 'dist/<%= meta.version %>/sitecore-<%= meta.version %>.packed.min.js'
      }
    },
    copy: {
      dist: {
        files: {
          "dist/<%= meta.version %>/deps/": "vendors/**",
          "archives/<%= meta.version %>/test/": "test/**",
          "archives/<%= meta.version %>/dist/deps/": "vendors/**",
          "archives/<%= meta.version %>/dist/sitecore-<%= meta.version %>.js": "dist/<%= meta.version %>/sitecore-<%= meta.version %>.js",
          "archives/<%= meta.version %>/dist/sitecore-<%= meta.version %>.min.js": "dist/<%= meta.version %>/sitecore-<%= meta.version %>.min.js"
        }
      },
      solution: {
        files: {
          "../../Website/sitecore/shell/client/assets/lib/dist/sitecore-<%= meta.version %>.js": "dist/sitecore-<%= meta.version %>.js",
          "../../Website/sitecore/shell/client/assets/lib/dist/sitecore-<%= meta.version %>.min.js": "dist/sitecore-<%= meta.version %>.min.js"
        }
      }
    }
  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
/*, 'uglify:dist', 'copy:dist', 'concat:oneFile', 'uglify:oneFile']*/
  grunt.registerTask('default', ['concat:dist', 'uglify:dist', 'copy:dist', 'concat:oneFile', 'uglify:oneFile']);
  //grunt.registerTask('generate', 'concat min copy:dist jasmine copy:solution');
};