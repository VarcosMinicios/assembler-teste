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
const runner_1 = require("@japa/runner");
const path_1 = require("path");
const dev_utils_1 = require("@poppinss/dev-utils");
const EnvParser_1 = require("../src/EnvParser");
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('EnvParser', (group) => {
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('ignore exception raised when unable to lookup .env file', async () => {
        const envParser = new EnvParser_1.EnvParser();
        await envParser.parse(fs.basePath);
    });
    (0, runner_1.test)('get value for a key defined inside .env file', async ({ assert }) => {
        await fs.add('.env', 'PORT=3333');
        const envParser = new EnvParser_1.EnvParser();
        await envParser.parse(fs.basePath);
        assert.equal(envParser.get('PORT'), '3333');
    });
    (0, runner_1.test)('get an object of values for defined keys', async ({ assert }) => {
        await fs.add('.env', ['PORT=3333', 'TZ=Asia/Calcutta'].join('\n'));
        const envParser = new EnvParser_1.EnvParser();
        await envParser.parse(fs.basePath);
        assert.deepEqual(envParser.asEnvObject(['PORT', 'TZ', 'HOST']), {
            PORT: '3333',
            TZ: 'Asia/Calcutta',
        });
    });
});
