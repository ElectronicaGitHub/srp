module.exports = function(grunt) {

  grunt.initConfig({
    // jshint: {
    //   files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    //   options: {
    //     globals: {
    //       jQuery: true
    //     }
    //   }
    // },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: './public/stylesheets',
          src: ['*.scss'],
          dest: './public/stylesheets/builded',
          ext: '.css'
        }]
      }
    },
    watch: {
      css: {
        files: ['**/*.scss'],
        // tasks: ['jshint'],
        tasks: ['sass'],
        options: {
          // spawn: false
          // livereload: true
        },
      },
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['watch']);

};