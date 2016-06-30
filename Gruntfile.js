/**
 * Created by syaku on 16. 1. 16..
 */

module.exports = function(grunt) {

	var title = grunt.option('title') || 'html build environment';
	var layout = grunt.option('layout') || '';
	var skin = grunt.option('skin') || '';

	grunt.option('title', title);
	grunt.option('layout', layout);
	grunt.option('skin', skin);

	console.log("-----------------------------------------");
	console.log(grunt.option('title'), grunt.option('layout'), grunt.option('skin'));

	// Project configuration.
	grunt.initConfig({

		// Remove built directory
		clean: {
			exclude: ['build/*.html'],
		},

		replace: {
			dist: {
				options: {
					patterns: [
						{
							json: {
								"title": grunt.option('title'),

								"include": {
									"common": '<%= grunt.file.read("includes/commons.html") %>'
								},

								"layout": grunt.option('layout'),
								"skin": grunt.option('skin')

							}
						},
						{
							match: /<#include\s{0,}=\s{0,}["'](.+)["'],["'](.+)["'],["'](.{0,})["']\s{0,}\/>/ig,
							replacement: function(found) {
								var regx = /<#include\s{0,}=\s{0,}["'](.+)["'],["'](.+)["'],["'](.{0,})["']\s{0,}\/>/i;
								if (regx.test(found)) {
									var data = regx.exec(found);

									var html = data[1];
									var type = data[2];
									var module = data[3];
									var skin = '';

									console.log("=======================================");
									console.log(html, type, module);

									if (type !== '') {
										switch(type) {
											case 'layouts' :
												skin = '/' + grunt.option('layout');
											break;
											case 'modules' :
												skin = '/' + grunt.option('skin');
											break;
											case 'pages' :
												skin = '/' + grunt.option('skin');
											break;
										}

										type = '/' + type;

										if (module !== '' && module !== null) type = type + '/' + module;
									}

									console.log('fixtures' + type + skin + '/' + html);

									return grunt.file.read('fixtures' + type + skin + '/' + html);
								} else {
									return '';
								}

							}
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['src/*.html'], dest: 'build/'}
				]
			}
		},

		copy: {
			main: {
				files: [
					{expand: true, src: ['resources/**'], dest: 'build/'}
				]
			},
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 8000,
					livereload: true,
					base: {
						path: 'build',
						options: {
							index: 'index.html'
						}
					}

				}
			}
		},

		symlink: {
			explicit: {
				src: 'bower_components',
				dest: 'build/bower_components'
			}
		}

	});

	// Load plugins used by this task gruntfile
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-symlink');

	// Task definitions
	grunt.registerTask('init', ['symlink']);
	grunt.registerTask('build', ['clean', 'replace', 'copy']);
	grunt.registerTask('server', ['connect:server:keepalive']);
	grunt.registerTask('default', ['build']);
};
