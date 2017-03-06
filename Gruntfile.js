(function () {
    "use strict";

    module.exports = function(grunt) {

        grunt.initConfig({
            jshint: {
                files: [
                    'Gruntfile.js',
                    'config.js',
                    'app/server.js',
                    'app/controllers/*.js',
                    'app/models/*.js',
                    'app/utils/*.js'],
                options: {
                    jshintrc: true
                }
            },
            apidoc: {
                default: {
                    src: ["app/controllers"],
                    dest: "app/doc"
                }
            },
            open : {
                dev: {
                    path: 'http://localhost:8080',
                    app: 'Google Chrome'
                }
            },
            exec: {
                start: {
                    cmd: 'pm2 start app/server.js --name "nf-eBOT - API" --log "logs/server.log"'
                },
                kill: {
                    cmd: 'pm2 kill'
                },
                restart: {
                    cmd: 'pm2 restart all'
                }
            },
            watch: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'exec:restart'],
                options: {
                    interval: 1000
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-apidoc');
        grunt.loadNpmTasks('grunt-exec');
        grunt.loadNpmTasks('grunt-open');

        grunt.registerTask('doc', ['apidoc']);

        grunt.registerTask('start', [
            'exec:start'
        ]);

        grunt.registerTask('dev', ['jshint', 'exec:start', 'open:dev', 'watch']);

    };

})();