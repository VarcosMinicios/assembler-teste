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
const test_helpers_1 = require("../test-helpers");
const PreloadFile_1 = __importDefault(require("../commands/Make/PreloadFile"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Preloaded File', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a preload file inside the start directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const preloadFile = new PreloadFile_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        preloadFile.name = 'viewGlobals';
        preloadFile.environment = ['console', 'web'];
        await preloadFile.run();
        const viewGlobals = await fs.get('start/viewGlobals.ts');
        const preloadTemplate = await templates.get('preload-file.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(viewGlobals), (0, test_helpers_1.toNewlineArray)(preloadTemplate));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            preloads: [
                {
                    file: './start/viewGlobals',
                    environment: ['console', 'web'],
                },
            ],
        });
    });
    (0, runner_1.test)('make a preload file inside custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            directories: {
                start: 'foo',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const preloadFile = new PreloadFile_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        preloadFile.name = 'viewGlobals';
        preloadFile.environment = ['console', 'web'];
        await preloadFile.run();
        const viewGlobals = await fs.get('foo/viewGlobals.ts');
        const preloadTemplate = await templates.get('preload-file.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(viewGlobals), (0, test_helpers_1.toNewlineArray)(preloadTemplate));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            directories: { start: 'foo' },
            preloads: [
                {
                    file: './foo/viewGlobals',
                    environment: ['console', 'web'],
                },
            ],
        });
    });
    (0, runner_1.test)('set preload file environment as repl', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const preloadFile = new PreloadFile_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        preloadFile.name = 'repl';
        preloadFile.environment = ['repl'];
        await preloadFile.run();
        const replFile = await fs.get('start/repl.ts');
        const preloadTemplate = await templates.get('preload-file.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(replFile), (0, test_helpers_1.toNewlineArray)(preloadTemplate));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            preloads: [
                {
                    file: './start/repl',
                    environment: ['repl'],
                },
            ],
        });
    });
    (0, runner_1.test)('prompt for environment when not explicitly defined', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const preloadFile = new PreloadFile_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        preloadFile.prompt.on('prompt', (question) => {
            question.select(2);
        });
        preloadFile.name = 'repl';
        await preloadFile.exec();
        const replFile = await fs.get('start/repl.ts');
        const preloadTemplate = await templates.get('preload-file.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(replFile), (0, test_helpers_1.toNewlineArray)(preloadTemplate));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            preloads: [
                {
                    file: './start/repl',
                    environment: ['repl'],
                },
            ],
        });
    });
    (0, runner_1.test)('do not set environment when all is selected', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const preloadFile = new PreloadFile_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        preloadFile.prompt.on('prompt', (question) => {
            question.select(0);
        });
        preloadFile.name = 'events';
        await preloadFile.exec();
        const replFile = await fs.get('start/events.ts');
        const preloadTemplate = await templates.get('preload-file.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(replFile), (0, test_helpers_1.toNewlineArray)(preloadTemplate));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            preloads: ['./start/events'],
        });
    });
});
