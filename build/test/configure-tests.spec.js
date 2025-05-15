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
runner_1.test.group('Configure Tests', (group) => {
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('setup tests', async ({ assert }) => {
        await fs.add('package.json', JSON.stringify({
            name: 'sample_app',
        }));
        await fs.ensureRoot();
        const app = new application_1.Application(fs.basePath, 'test', {});
        const invoke = new Invoke_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        invoke.packages = ['tests'];
        await invoke.run();
        assert.isTrue(await fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, 'test.ts')));
        assert.isTrue(await fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, 'tests/bootstrap.ts')));
        assert.isTrue(await fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, 'tests/functional/hello_world.spec.ts')));
        assert.isTrue(await fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, 'contracts/tests.ts')));
    })
        .timeout(0)
        .skip(!!process.env.CI);
});
