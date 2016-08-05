module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    hostname:'*',
                    port: 8082,
                    base: './deploy'
                }
            }
        },
        concat: {
            dist: {
                src: [  "src/lib/**/*.js", "src/game/**/*.js"],
                dest: 'deploy/js/<%= pkg.name %>-v<%=pkg.version%>.js'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
        open: {
            dev: {
                path: 'http://localhost:8082/index.html',
                app: 'chrome'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'connect', 'open', 'watch']);

}