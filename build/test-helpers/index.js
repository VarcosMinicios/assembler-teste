"use strict";
/*
 * @adonisjs/assembler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dimYellow = exports.warning = exports.error = exports.success = exports.info = exports.toNewlineArray = void 0;
function toNewlineArray(contents) {
    return contents.split(/\r?\n/);
}
exports.toNewlineArray = toNewlineArray;
exports.info = '[ blue(info) ]';
exports.success = '[ green(success) ]';
exports.error = '[ red(error) ]';
exports.warning = '[ yellow(warn) ]';
const dimYellow = (value) => `dim(yellow(${value}))`;
exports.dimYellow = dimYellow;
