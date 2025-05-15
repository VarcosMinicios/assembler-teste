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
const path_1 = require("path");
const ace_1 = require("@adonisjs/ace");
const helpers_1 = require("@poppinss/utils/build/helpers");
/**
 * Get the file path to every assembler commands
 */
const commandsPaths = (0, helpers_1.fsReadAll)((0, path_1.join)(__dirname, '../commands'), (file) => !file.includes('Base') && file.endsWith('.js'))
    .map((file) => `./commands/${file}`)
    .map((file) => file.replace(/\\/g, '/'));
/**
 * Generates ace-manifest file
 */
new ace_1.ManifestGenerator((0, path_1.join)(__dirname, '..'), commandsPaths).generate();
