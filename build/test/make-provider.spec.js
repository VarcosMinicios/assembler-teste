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
const Provider_1 = __importDefault(require("../commands/Make/Provider"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Provider', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a provider inside the default directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const provider = new Provider_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        provider.name = 'app';
        await provider.run();
        const AppProvider = await fs.get('providers/AppProvider.ts');
        const ProviderTemplate = await templates.get('provider.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(AppProvider), (0, test_helpers_1.toNewlineArray)(ProviderTemplate.replace('{{ filename }}', 'AppProvider')));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            providers: ['./providers/AppProvider'],
        });
    });
    (0, runner_1.test)('make a provider inside a custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            directories: {
                providers: 'foo',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const provider = new Provider_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        provider.name = 'app';
        await provider.run();
        const AppProvider = await fs.get('foo/AppProvider.ts');
        const ProviderTemplate = await templates.get('provider.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(AppProvider), (0, test_helpers_1.toNewlineArray)(ProviderTemplate.replace('{{ filename }}', 'AppProvider')));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            directories: {
                providers: 'foo',
            },
            providers: ['./foo/AppProvider'],
        });
    });
    (0, runner_1.test)('setup correct path when nested provider is created', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const provider = new Provider_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        provider.name = 'auth/app';
        await provider.run();
        const AppProvider = await fs.get('providers/auth/AppProvider.ts');
        const ProviderTemplate = await templates.get('provider.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(AppProvider), (0, test_helpers_1.toNewlineArray)(ProviderTemplate.replace('{{ filename }}', 'AppProvider')));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            providers: ['./providers/auth/AppProvider'],
        });
    });
    (0, runner_1.test)('make ace provider', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const provider = new Provider_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        provider.name = 'app';
        provider.ace = true;
        await provider.run();
        const AppProvider = await fs.get('providers/AppProvider.ts');
        const ProviderTemplate = await templates.get('provider.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(AppProvider), (0, test_helpers_1.toNewlineArray)(ProviderTemplate.replace('{{ filename }}', 'AppProvider')));
        const rcRawContents = await fs.get('.adonisrc.json');
        assert.deepEqual(JSON.parse(rcRawContents), {
            aceProviders: ['./providers/AppProvider'],
        });
    });
});
