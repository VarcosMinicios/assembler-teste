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
const View_1 = __importDefault(require("../commands/Make/View"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('Make Command', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make an empty view inside the default directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const view = new View_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        view.name = 'welcome';
        await view.run();
        const welcomeView = await fs.get('resources/views/welcome.edge');
        assert.deepEqual(welcomeView.trim(), '');
    });
    (0, runner_1.test)('make a view inside a nested directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const view = new View_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        view.name = 'users/welcome';
        await view.run();
        const welcomeView = await fs.get('resources/views/users/welcome.edge');
        assert.deepEqual(welcomeView.trim(), '');
    });
    (0, runner_1.test)('make an empty view inside custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            directories: {
                views: 'public/views',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const view = new View_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        view.name = 'welcome';
        await view.run();
        const welcomeView = await fs.get('public/views/welcome.edge');
        assert.deepEqual(welcomeView.trim(), '');
    });
});
