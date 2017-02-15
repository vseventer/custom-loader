/* global describe, it, after */
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

// Strict mode.
'use strict';

// Standard lib.
const fs = require('fs');
const path = require('path');

// Package modules.
const expect = require('chai').expect;
const tmp = require('tmp');
const webpack = require('webpack');

// Configure.
const customLoader = require.resolve('../');

// Test suite.
describe('custom-loader', () => {
  // Output.
  const output = tmp.fileSync({ postfix: '.js' });
  after(output.removeCallback);

  // Tests.
  it('should allow a custom loader', (done) => {
    const replacement = `module.exports = ${Math.random()};`;
    webpack({
      context: __dirname,
      entry: './fixtures/entry.js',
      output: {
        filename: path.basename(output.name),
        path: path.dirname(output.name)
      },
      module: {
        rules: [
          {
            test: /.js$/,
            use: {
              loader: customLoader,
              options: {
                callback: (source) => replacement
              }
            }
          }
        ]
      }
    }, (err, stats) => {
      if (stats.compilation.errors && stats.compilation.errors.length) {
        err = stats.compilation.errors[0].error;
      }

      // Check file contents.
      const contents = fs.readFileSync(output.name, { encoding: 'utf8' });
      expect(contents).to.contain(replacement);

      done(err);
    });
  });
  it('should fail if a callback is not specified', (done) => {
    webpack({
      context: __dirname,
      entry: './fixtures/entry.js',
      output: {
        filename: path.basename(output.name),
        path: path.dirname(output.name)
      },
      module: {
        rules: [
          {
            test: /.js$/,
            use: customLoader
          }
        ]
      }
    }, (err, stats) => {
      expect(stats).to.have.deep.property('compilation.errors[0].error.message');
      expect(stats.compilation.errors[0].error.message).to.contain('callback');
      done(err);
    });
  });
});
