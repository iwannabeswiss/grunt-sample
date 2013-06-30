module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        // insert here other non-less stylesheets to concatenate
        src: ['tmp/styles.css'],
        dest: 'build/css/<%= pkg.bundleName %>.css'
      },
      coffee: {
        separator: ';',
        src: ['src/js/**/*.coffee'],
        dest:'tmp/scripts.coffee'
      },
      js: {
        separator: ';',
        src: ['src/js/**/*.js', 'tmp/scripts.js'],
        dest: 'build/js/<%= pkg.bundleName %>.js'
      }
    },
    coffee: {
      compile: {
        src: ['tmp/scripts.coffee'],
        dest: 'tmp/scripts.js',
        options: {
          bare: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/js/<%= pkg.bundleName %>.js',
        dest: 'build/js/<%= pkg.bundleName %>.min.js'
      }
    },
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'src/js/**/*.js', '!site/assets/js/**/*.min.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    clean: {
      tmp: ['tmp'],
      hooks: ['.git/hooks/pre-commit']
    },
    shell: {
      hooks: {
        command: [
          'cp git-hooks/pre-commit .git/hooks/',
          'chmod +x .git/hooks/pre-commit'
        ].join('&&')
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/less/*.less'],
      tasks: ['local']
    },
    less: {
      options: {
        yuicompress: false
      },
      files: {
        // modify the wildcard if you use @import in your less files
        src: 'src/less/*.less',
        dest: 'tmp/styles.css'
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      site: {
        src: 'build/css/<%= pkg.bundleName %>.css',
        dest: 'build/css/<%= pkg.bundleName %>.min.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('hookers', ['clean:hooks', 'shell:hooks']);
  grunt.registerTask('test', ['jshint', 'less']);
  grunt.registerTask('local', ['jshint', 'concat:coffee', 'coffee', 'concat:js', 'less', 'concat:css', 'clean:tmp']);
  grunt.registerTask('release', ['jshint', 'concat:coffee', 'coffee', 'concat:js', 'uglify', 'less', 'concat:css', 'cssmin', 'clean:tmp']);
  grunt.registerTask('default', ['local']);
};