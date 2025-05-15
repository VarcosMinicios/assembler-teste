"use strict";
/*
 * @adonisjs/assembler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("@japa/runner");
const path_1 = require("path");
const ace_1 = require("@adonisjs/ace");
const dev_utils_1 = require("@poppinss/dev-utils");
const application_1 = require("@adonisjs/application");
const Invoke_1 = __importDefault(require("../commands/Invoke"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('Invoke', (group) => {
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('execute instructions defined in package.json file', async ({ assert }) => {
        await fs.add('node_modules/@adonisjs/sample/package.json', JSON.stringify({
            name: '@adonisjs/sample',
            adonisjs: {
                env: {
                    PORT: '3333',
                },
            },
        }));
        const app = new application_1.Application(fs.basePath, 'test', {});
        const invoke = new Invoke_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        invoke.packages = ['@adonisjs/sample'];
        await invoke.run();
        const envFile = await fs.fsExtra.readFile((0, path_1.join)(fs.basePath, '.env'), 'utf-8');
        const envExampleFile = await fs.fsExtra.readFile((0, path_1.join)(fs.basePath, '.env.example'), 'utf-8');
        assert.equal(envFile.trim(), 'PORT=3333');
        assert.equal(envExampleFile.trim(), 'PORT=3333');
    });
});
