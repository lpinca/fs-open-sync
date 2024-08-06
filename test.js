'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const test = require('node:test');

const open = require('./index.js');

test('is exported as a function', function () {
  assert.strictEqual(typeof open, 'function');
});

test('throws an error if the "path" argument is invalid', function () {
  for (const value of [undefined, null, true, 1, 2n, Symbol('foo')]) {
    assert.throws(
      function () {
        open(value);
      },
      function (err) {
        assert.ok(err instanceof TypeError);
        assert.strictEqual(
          err.message,
          'The "path" argument must be of type string or an instance of Buffer'
        );

        return true;
      }
    );
  }
});

test('throws an error if the "flags" argument is invalid', function () {
  for (const value of [true, 2n, Symbol('foo')]) {
    assert.throws(
      function () {
        open(__filename, value);
      },
      function (err) {
        assert.ok(err instanceof TypeError);
        assert.strictEqual(
          err.message,
          'The "flags" argument must be of type number or string'
        );

        return true;
      }
    );
  }

  for (const value of [NaN, 10.5, -2147483649, 2147483648]) {
    assert.throws(
      function () {
        open(__filename, value);
      },
      function (err) {
        assert.ok(err instanceof RangeError);
        assert.strictEqual(
          err.message,
          'The value of "flags" must be a 32-bit integer'
        );

        return true;
      }
    );
  }

  assert.throws(
    function () {
      open(__filename, 'foo');
    },
    function (err) {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(
        err.message,
        'The value of the "flags" argument is invalid'
      );

      return true;
    }
  );
});

test('throws an error if the "mode" argument is invalid', function () {
  for (const value of [true, 2n, Symbol('foo')]) {
    assert.throws(
      function () {
        open(__filename, undefined, value);
      },
      function (err) {
        assert.ok(err instanceof TypeError);
        assert.strictEqual(
          err.message,
          'The "mode" argument must be of type number or string'
        );

        return true;
      }
    );
  }

  for (const value of [NaN, 10.5, -2147483649, 2147483648, '77777777777']) {
    assert.throws(
      function () {
        open(__filename, undefined, value);
      },
      function (err) {
        assert.ok(err instanceof RangeError);
        assert.strictEqual(
          err.message,
          'The value of "mode" must be a 32-bit integer'
        );

        return true;
      }
    );
  }
});

test('throws an error if the file does not exists', function () {
  const randomString = crypto.randomBytes(16).toString('hex');

  assert.throws(
    function () {
      open(randomString);
    },
    function (err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'no such file or directory');
      assert.strictEqual(err.code, 'ENOENT');
      assert.strictEqual(err.path, randomString);
      assert.strictEqual(err.syscall, 'open');

      return true;
    }
  );
});

test('returns an integer representing the file descriptor', function () {
  const fd = open(__filename);

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});

test('accepts the "path" argument as an instance of Buffer', function () {
  const fd = open(Buffer.from(__filename));

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});

test('accepts the "flags" argument as an integer', function () {
  const fd = open(Buffer.from(__filename), fs.constants.O_RDONLY);

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});

test('accepts the "flags" argument as a string', function () {
  const fd = open(Buffer.from(__filename), 'r');

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});

test('accepts the "mode" argument as an integer', function () {
  const fd = open(Buffer.from(__filename), null, 0o666);

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});

test('accepts the "mode" argument as an integer', function () {
  const fd = open(Buffer.from(__filename), null, '666');

  assert.ok(Number.isInteger(fd));
  assert.ok(fd > 0);

  fs.closeSync(fd);
});
