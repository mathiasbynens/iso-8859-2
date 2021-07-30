/*! https://mths.be/iso-8859-2 v<%= version %> by @mathias | MIT license */
;(function() {

	const stringFromCharCode = String.fromCharCode;

	const INDEX_BY_CODE_POINT = <%= indexByCodePoint %>;
	const INDEX_BY_POINTER = <%= indexByPointer %>;

	// https://encoding.spec.whatwg.org/#error-mode
	const error = (codePoint, mode) => {
		if (mode == 'replacement') {
			return '\uFFFD';
		}
		if (codePoint !== null && mode === 'html') {
			return '&#' + codePoint + ';';
		}
		// Else, `mode == 'fatal'`.
		throw new Error();
	};

	// https://encoding.spec.whatwg.org/#single-byte-decoder
	const decode = (input, options) => {
		let mode;
		if (options && options.mode) {
			mode = options.mode.toLowerCase();
		}
		// “An error mode […] is either `replacement` (default) or `fatal` for a
		// decoder.”
		if (mode !== 'replacement' && mode !== 'fatal') {
			mode = 'replacement';
		}
		let result = '';
		for (let index = 0; index < input.length; index++) {
			const byteValue = input.charCodeAt(index);
			// “If `byte` is in the range `0x00` to `0x7F`, return a code point whose
			// value is `byte`.”
			if (byteValue >= 0x00 && byteValue <= 0x7F) {
				result += stringFromCharCode(byteValue);
				continue;
			}
			// “Let `code point` be the index code point for `byte − 0x80` in index
			// `single-byte`.”
			const pointer = byteValue - 0x80;
			if (INDEX_BY_POINTER.has(pointer)) {
				// “Return a code point whose value is `code point`.”
				result += INDEX_BY_POINTER.get(pointer);
			} else {
				// “If `code point` is `null`, return `error`.”
				result += error(null, mode);
			}
		}
		return result;
	};

	// https://encoding.spec.whatwg.org/#single-byte-encoder
	const encode = (input, options) => {
		let mode;
		if (options && options.mode) {
			mode = options.mode.toLowerCase();
		}
		// “An error mode […] is either `fatal` (default) or `HTML` for an
		// encoder.”
		if (mode !== 'fatal' && mode !== 'html') {
			mode = 'fatal';
		}
		let result = '';
		for (let index = 0; index < input.length; index++) {
			const codePoint = input.charCodeAt(index);
			// “If `code point` is in the range U+0000 to U+007F, return a byte whose
			// value is `code point`.”
			if (codePoint >= 0x00 && codePoint <= 0x7F) {
				result += stringFromCharCode(codePoint);
				continue;
			}
			// “Let `pointer` be the index pointer for `code point` in index
			// `single-byte`.”
			if (INDEX_BY_CODE_POINT.has(codePoint)) {
				const pointer = INDEX_BY_CODE_POINT.get(codePoint);
				// “Return a byte whose value is `pointer + 0x80`.”
				result += stringFromCharCode(pointer + 0x80);
			} else {
				// “If `pointer` is `null`, return `error` with `code point`.”
				result += error(codePoint, mode);
			}
		}
		return result;
	};

	const iso88592 = {
		encode: encode,
		decode: decode,
		labels: <%= labels %>,
		version: '<%= version %>',
	};

	module.exports = iso88592;

}());
