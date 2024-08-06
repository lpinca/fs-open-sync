'use strict';

const {
  constants: {
    O_RDONLY,
    O_SYNC,
    O_RDWR,
    O_TRUNC,
    O_CREAT,
    O_WRONLY,
    O_EXCL,
    O_APPEND
  }
} = require('fs');

const binding = require('node-gyp-build')(__dirname);

/**
 * Converts a string describing the file access type to the corresponding
 * numerical value.
 *
 * Code adapted from
 * https://github.com/nodejs/node/blob/v22.5.1/lib/internal/fs/utils.js#L598-L638,
 * released under the MIT license.
 *
 * @param {string} str The type of access
 * @return {number} The converted access type
 * @throws {RangeError} If the value of `str` is not in the set of allowed
 *     values
 * @private
 */
/* istanbul ignore next */
function toFlags(str) {
  switch (str) {
    case 'r':
      return O_RDONLY;
    case 'rs':
    case 'sr':
      return O_RDONLY | O_SYNC;
    case 'r+':
      return O_RDWR;
    case 'rs+':
    case 'sr+':
      return O_RDWR | O_SYNC;
    case 'w':
      return O_TRUNC | O_CREAT | O_WRONLY;
    case 'wx':
    case 'xw':
      return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;
    case 'w+':
      return O_TRUNC | O_CREAT | O_RDWR;
    case 'wx+':
    case 'xw+':
      return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;
    case 'a':
      return O_APPEND | O_CREAT | O_WRONLY;
    case 'ax':
    case 'xa':
      return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;
    case 'as':
    case 'sa':
      return O_APPEND | O_CREAT | O_WRONLY | O_SYNC;
    case 'a+':
      return O_APPEND | O_CREAT | O_RDWR;
    case 'ax+':
    case 'xa+':
      return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
    case 'as+':
    case 'sa+':
      return O_APPEND | O_CREAT | O_RDWR | O_SYNC;
    default:
      throw new RangeError('The value of the "flags" argument is invalid');
  }
}

/**
 * Opens the file specified by `path`
 *
 * @param {(Buffer|string)} path The file path
 * @param {(number|string)} [flags] The access mode
 * @param {(number|string)} [mode] The file mode bits to be applied when a new
 *     file is created
 * @return {number} An integer representing the file descriptor
 * @throws {(RangeError|TypeError)}
 * @public
 */
function open(path, flags, mode) {
  if (typeof path !== 'string') {
    if (!Buffer.isBuffer(path)) {
      throw TypeError(
        'The "path" argument must be of type string or an instance of Buffer'
      );
    }
  } else {
    path = Buffer.from(path);
  }

  if (flags === null || flags === undefined) {
    flags = O_RDONLY;
  } else if (typeof flags === 'number') {
    if (!Number.isInteger(flags) || flags < -2147483648 || flags > 2147483647) {
      throw new RangeError('The value of "flags" must be a 32-bit integer');
    }
  } else if (typeof flags === 'string') {
    flags = toFlags(flags);
  } else {
    throw TypeError('The "flags" argument must be of type number or string');
  }

  if (typeof mode === 'string') {
    mode = Number.parseInt(mode, 8);
  }

  if (typeof mode === 'number') {
    if (!Number.isInteger(mode) || mode < -2147483648 || mode > 2147483647) {
      throw new RangeError('The value of "mode" must be a 32-bit integer');
    }
  } else if (mode === null || mode === undefined) {
    mode = 0o666;
  } else {
    throw TypeError('The "mode" argument must be of type number or string');
  }

  return binding.open(path, flags, mode);
}

module.exports = open;
