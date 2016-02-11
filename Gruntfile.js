module.exports = function(grunt) {

  grunt.initConfig({
    postcss: {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({
                    browsers: ['last 2 versions']
                })
            ]
        },
        dist: {
            src: './public/stylesheets/builded/*.css'
        }
    },
    sass: {
      dist: {
        options : {
          style : 'compressed'
        },
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
        tasks: ['sass', 'postcss'],
        options: {
        },
      },
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['watch']);

};