# iso-8859-2 [![Build status](https://github.com/mathiasbynens/iso-8859-2/workflows/run-checks/badge.svg)](https://github.com/mathiasbynens/iso-8859-2/actions?query=workflow%3Arun-checks) [![iso-8859-2 on npm](https://img.shields.io/npm/v/iso-8859-2)](https://www.npmjs.com/package/iso-8859-2)

_iso-8859-2_ is a robust JavaScript implementation of [the iso-8859-2 character encoding as defined by the Encoding Standard](https://encoding.spec.whatwg.org/#iso-8859-2).

This encoding is known under the following names: csisolatin2, iso-8859-2, iso-ir-101, iso8859-2, iso88592, iso_8859-2, iso_8859-2:1987, l2, and latin2.

## Installation

Via [npm](https://www.npmjs.com/):

```bash
npm install iso-8859-2
```

In a browser or in [Node.js](https://nodejs.org/):

```js
import {encode, decode, labels} from 'iso-8859-2';
// or…
import * as iso88592 from 'iso-8859-2';
```

## API

### `iso88592.labels`

An array of strings, each representing a [label](https://encoding.spec.whatwg.org/#label) for this encoding.

### `iso88592.encode(input, options)`

This function takes a plain text string (the `input` parameter) and encodes it according to iso-8859-2. The return value is an environment-agnostic `Uint16Array` of which each element represents an octet as per iso-8859-2.

```js
const encodedData = iso88592.encode(text);
```

The optional `options` object and its `mode` property can be used to set the error mode. The two available error modes are `'fatal'` (the default) or `'replacement'`. (Note: This differs from [the spec](https://encoding.spec.whatwg.org/#error-mode), which recognizes “fatal” and HTML” modes for encoders. The reason behind this difference is that the spec algorithm is aimed at producing HTML, whereas this library encodes into an environment-agnostic `Uint16Array` of bytes.)

```js
const encodedData = iso88592.encode(text, {
  mode: 'replacement'
});
// If `text` contains a symbol that cannot be represented in iso-8859-2,
// instead of throwing an error, it becomes 0xFFFD.
```

### `iso88592.decode(input, options)`

This function decodes `input` according to iso-8859-2. The `input` parameter can either be a `Uint16Array` of which each element represents an octet as per iso-8859-2, or a ‘byte string’ (i.e. a string of which each item represents an octet as per iso-8859-2).

```js
const text = iso88592.decode(encodedData);
```

The optional `options` object and its `mode` property can be used to set the [error mode](https://encoding.spec.whatwg.org/#error-mode). For decoding, the error mode can be `'replacement'` (the default) or `'fatal'`.

```js
const text = iso88592.decode(encodedData, {
  mode: 'fatal'
});
// If `encodedData` contains an invalid byte for the iso-8859-2 encoding,
// instead of replacing it with U+FFFD in the output, an error is thrown.
```

## Notes

[Similar modules for other single-byte legacy encodings are available.](https://www.npmjs.com/browse/keyword/legacy-encoding)

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

_iso-8859-2_ is available under the [MIT](https://mths.be/mit) license.
