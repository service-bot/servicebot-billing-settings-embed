module.exports = function(grunt) {

    grunt.initConfig({
        sass: {
            dist:{
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/main.css' : 'scss/main.scss',
                }
            }
        },
        watch: {
            css: {
                files: ['scss/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['watch']);

};