/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @see https://webpack.js.org/development/how-to-write-a-loader/

// Strict mode.
'use strict';

// Package modules.
const loaderUtils = require('loader-utils');

// Exports.
module.exports = function (source, map) {
  const context = this; // Extract.

  // Flag as cacheable.
  context.cacheable();

  // Extract config.
  const config = loaderUtils.getLoaderConfig(context, 'customLoader');
  if (typeof config.callback !== 'function') {
    throw new Error('Assertion failed: config.callback must be a function.');
  }

  // Invoke custom loader.
  return config.callback.apply(context, source, map, context.callback);
};

// Mark as raw.
module.exports.raw = true;
