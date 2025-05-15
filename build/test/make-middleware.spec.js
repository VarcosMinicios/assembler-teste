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
const Middleware_1 = __importDefault(require("../commands/Make/Middleware"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Middleware', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a middleware inside the default directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const middleware = new Middleware_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        middleware.name = 'spoof_accept';
        await middleware.run();
        const SpoofMiddleware = await fs.get('app/Middleware/SpoofAccept.ts');
        const MiddlewareTemplate = await templates.get('middleware.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(SpoofMiddleware), (0, test_helpers_1.toNewlineArray)(MiddlewareTemplate.replace('{{ filename }}', 'SpoofAccept')));
    });
    (0, runner_1.test)('make a middleware inside a custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            namespaces: {
                middleware: 'App/Module/Testing/Middleware',
            },
            autoloads: {
                App: './app',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const middleware = new Middleware_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        middleware.name = 'spoof_accept';
        await middleware.run();
        const SpoofMiddleware = await fs.get('app/Module/Testing/Middleware/SpoofAccept.ts');
        const MiddlewareTemplate = await templates.get('middleware.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(SpoofMiddleware), (0, test_helpers_1.toNewlineArray)(MiddlewareTemplate.replace('{{ filename }}', 'SpoofAccept')));
    });
});
