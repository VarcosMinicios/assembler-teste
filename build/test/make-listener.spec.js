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
const Listener_1 = __importDefault(require("../commands/Make/Listener"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Listener', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a listener inside the default directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const listener = new Listener_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        listener.name = 'user';
        await listener.run();
        const UserListener = await fs.get('app/Listeners/User.ts');
        const ListenerTemplate = await templates.get('event-listener.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(UserListener), (0, test_helpers_1.toNewlineArray)(ListenerTemplate.replace('{{ filename }}', 'User')));
    });
    (0, runner_1.test)('make a listener inside a custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            namespaces: {
                eventListeners: 'App/Events/Listeners',
            },
            aliases: {
                App: './app',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const listener = new Listener_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        listener.name = 'user';
        await listener.run();
        const UserListener = await fs.get('app/Events/Listeners/User.ts');
        const ListenerTemplate = await templates.get('event-listener.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(UserListener), (0, test_helpers_1.toNewlineArray)(ListenerTemplate.replace('{{ filename }}', 'User')));
    });
});
