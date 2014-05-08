(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	// The `iso88592` object to test
	var iso88592 = root.iso88592 || (root.iso88592 = (
		iso88592 = load('../iso-8859-2.js') || root.iso88592,
		iso88592 = iso88592.iso88592 || iso88592
	));

	/*--------------------------------------------------------------------------*/

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment
	QUnit.module('iso88592');

	test('iso88592.encode', function() {
		equal(
			iso88592.encode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'U+0000 to U+007F remain unchanged'
		);
		equal(
			iso88592.encode(<%= decoded %>),
			<%= encoded %>,
			'Encoding all other symbols in the character set'
		);
		raises(
			function() {
				iso88592.encode('\uFFFF');
			},
			Error,
			'Encoding a code point that is invalid for this encoding throws an error in `fatal` mode, which is the implied default for `encode()`'
		);
		raises(
			function() {
				iso88592.encode('\uFFFF', { 'mode': 'fatal' });
			},
			Error,
			'Encoding a code point that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso88592.encode('\uFFFF', { 'mode': 'FATAL' });
			},
			Error,
			'Mode names are case-insensitive'
		);
		raises(
			function() {
				iso88592.encode('\uFFFF', { 'mode': 'fAtAl' });
			},
			Error,
			'Mode names are case-insensitive'
		);
		equal(
			iso88592.encode('\uFFFF', { 'mode': 'html' }),
			'&#65535;',
			'Encoding a code point that is invalid for this encoding returns an HTML entity in `html` mode'
		);
		equal(
			iso88592.encode('\uFFFF', { 'mode': 'HTML' }),
			'&#65535;',
			'Mode names are case-insensitive'
		);
		equal(
			iso88592.encode('\uFFFF', { 'mode': 'hTmL' }),
			'&#65535;',
			'Mode names are case-insensitive'
		);
	});

	test('iso88592.decode', function() {
		equal(
			iso88592.decode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'U+0000 to U+007F remain unchanged'
		);
		equal(
			iso88592.decode(<%= encoded %>),
			<%= decoded %>,
			'Decoding all other symbols in the character set'
		);
		equal(
			iso88592.decode('\uFFFF'),
			'\uFFFD',
			'Decoding a byte that is invalid for this encoding returns U+FFFD in `replacement` mode, which is the implied default for `decode()`'
		);
		equal(
			iso88592.decode('\uFFFF', { 'mode': 'replacement' }),
			'\uFFFD',
			'Decoding a byte that is invalid for this encoding returns U+FFFD in `replacement` mode'
		);
		equal(
			iso88592.decode('\uFFFF', { 'mode': 'REPLACEMENT' }),
			'\uFFFD',
			'Mode names are case-insensitive'
		);
		equal(
			iso88592.decode('\uFFFF', { 'mode': 'rEpLaCeMeNt' }),
			'\uFFFD',
			'Mode names are case-insensitive'
		);
		raises(
			function() {
				iso88592.decode('\uFFFF', { 'mode': 'fatal' });
			},
			Error,
			'Decoding a byte that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso88592.decode('\uFFFF', { 'mode': 'FATAL' });
			},
			Error,
			'Decoding a byte that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso88592.decode('\uFFFF', { 'mode': 'fAtAl' });
			},
			Error,
			'Mode names are case-insensitive'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
