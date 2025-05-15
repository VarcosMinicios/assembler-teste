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
const fs_extra_1 = require("fs-extra");
const ace_1 = require("@adonisjs/ace");
const dev_utils_1 = require("@poppinss/dev-utils");
const application_1 = require("@adonisjs/application");
const Test_1 = __importDefault(require("../commands/Make/Test"));
const test_helpers_1 = require("../test-helpers");
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Test', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a test inside the suite directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            tests: {
                suites: [{ name: 'functional', files: ['tests/functional/**/*.spec.ts'] }],
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const makeTest = new Test_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        makeTest.suite = 'functional';
        makeTest.name = 'Users';
        await makeTest.run();
        const testFile = await fs.get('tests/functional/user.spec.ts');
        const testTemplate = await templates.get('test.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(testFile), (0, test_helpers_1.toNewlineArray)(testTemplate.replace('{{ name }}', 'Users')));
    });
    (0, runner_1.test)('make a test inside nested directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            tests: {
                suites: [{ name: 'functional', files: ['tests/functional/**/*.spec.ts'] }],
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const makeTest = new Test_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        makeTest.suite = 'functional';
        makeTest.name = 'users/index';
        await makeTest.run();
        const testFile = await fs.get('tests/functional/users/index.spec.ts');
        const testTemplate = await templates.get('test.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(testFile), (0, test_helpers_1.toNewlineArray)(testTemplate.replace('{{ name }}', 'Users index')));
    });
    (0, runner_1.test)('return error when suite is not registered', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const makeTest = new Test_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        makeTest.suite = 'functional';
        makeTest.name = 'Users/index';
        await makeTest.run();
        assert.deepEqual(makeTest.ui.testingRenderer.logs, [
            {
                stream: 'stderr',
                message: '[ red(error) ]  Invalid suite "functional". Make sure the suite is registered inside the .adonisrc.json file',
            },
        ]);
        assert.isFalse(await fs.exists('tests/functional/users/index.spec.ts'));
    });
});
