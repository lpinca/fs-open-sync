# fs-open-sync

[![Version npm][npm-fs-open-sync-badge]][npm-fs-open-sync]
[![Build Status][ci-fs-open-sync-badge]][ci-fs-open-sync]
[![Coverage Status][coverage-fs-open-sync-badge]][coverage-fs-open-sync]

Like [`fs.openSync()`][] but does not interfere with the provided pathname.
Useful to open special files like `CONOUT$`, `\\.\nul`, etc.

## Install

```
npm install --save fs-open-sync
```

## API

This module exports a single function that works like [`fs.openSync()`][].

### `open(path[, flags[, mode]])`

#### Arguments

- `path` {Buffer|string} The file pathname.
- `flags` {number|string} The access mode. Defaults to `'r'`.
- `mode` {number|string} The file mode bits to be applied when a new file is
  created. Defaults to `0o666`.

#### Return value

An integer representing the file descriptor.

#### Exceptions

Throws a `RangeError` or `TypeError` if an argument in not valid or an `Error`
if the file cannot be opened.

#### Example

```js
import open from 'fs-open-sync'; // Also available as a named export.
import { fileURLToPath } from 'node:url';
import { ok } from 'node:assert';

const __filename = fileURLToPath(import.meta.url);
const fd = open(__filename);

ok(fd > 0);
```

## License

[MIT](LICENSE)

[npm-fs-open-sync-badge]: https://img.shields.io/npm/v/fs-open-sync.svg
[npm-fs-open-sync]: https://www.npmjs.com/package/fs-open-sync
[ci-fs-open-sync-badge]:
  https://img.shields.io/github/actions/workflow/status/lpinca/fs-open-sync/ci.yml?branch=master&label=CI
[ci-fs-open-sync]:
  https://github.com/lpinca/fs-open-sync/actions?query=workflow%3ACI+branch%3Amaster
[coverage-fs-open-sync-badge]:
  https://img.shields.io/coveralls/lpinca/fs-open-sync/master.svg
[coverage-fs-open-sync]:
  https://coveralls.io/r/lpinca/fs-open-sync?branch=master
[`fs.openSync()`]: https://nodejs.org/api/fs.html#fsopensyncpath-flags-mode
