module.exports = function(grunt) {

	grunt.initConfig({
		'shell': {
			'options': {
				'stdout': true,
				'stderr': true,
				'failOnError': true
			},
			'fetch': {
				'command': 'curl http://encoding.spec.whatwg.org/index-iso-8859-2.txt > data/index.txt'
			},
			'transform-data': {
				'command': 'node scripts/transform-data.js'
			},
			'cover': {
				'command': 'istanbul cover --report "html" --verbose --dir "coverage" "tests/tests.js"'
			},
			'test-narwhal': {
				'command': 'echo "Testing in Narwhal..."; export NARWHAL_OPTIMIZATION=-1; narwhal "tests/tests.js"'
			},
			'test-phantomjs': {
				'command': 'echo "Testing in PhantomJS..."; phantomjs "tests/tests.js"'
			},
			// Rhino 1.7R4 has a bug that makes it impossible to test in.
			// https://bugzilla.mozilla.org/show_bug.cgi?id=775566
			// To test, use Rhino 1.7R3, or wait (heh) for the 1.7R5 release.
			'test-rhino': {
				'command': 'echo "Testing in Rhino..."; rhino -opt -1 "tests.js"',
				'options': {
					'execOptions': {
						'cwd': 'tests'
					}
				}
			},
			'test-ringo': {
				'command': 'echo "Testing in Ringo..."; ringo -o -1 "tests/tests.js"'
			},
			'test-node': {
				'command': 'echo "Testing in Node..."; node "tests/tests.js"'
			},
			'test-browser': {
				'command': 'echo "Testing in a browser..."; open "tests/index.html"'
			}
		},
		'template': {
			'build': {
				'options': {
					'data': function() {
						return require('./scripts/export-data.js');
					}
				},
				'files': {
					'iso88592.js': ['src/iso88592.js']
				}
			},
			'build-tests': {
				'options': {
					'data': function() {
						return require('./scripts/export-data.js');
					}
				},
				'files': {
					'tests/tests.js': ['tests/tests.src.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('cover', 'shell:cover');
	grunt.registerTask('ci', [
		'template',
		'shell:test-narwhal',
		'shell:test-phantomjs',
		'shell:test-rhino',
		'shell:test-ringo',
		'shell:test-node',
	]);
	grunt.registerTask('test', [
		'ci',
		'shell:test-browser'
	]);

	grunt.registerTask('fetch', [
		'shell:fetch',
		'build'
	]);

	grunt.registerTask('build', [
		'shell:transform-data',
		'default'
	]);

	grunt.registerTask('default', [
		'template',
		'shell:test-node'
	]);

};
