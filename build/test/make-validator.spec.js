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
const Validator_1 = __importDefault(require("../commands/Make/Validator"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
const templates = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', 'templates'));
runner_1.test.group('Make Validator', (group) => {
    group.setup(() => {
        process.env.ADONIS_ACE_CWD = fs.basePath;
    });
    group.teardown(() => {
        delete process.env.ADONIS_ACE_CWD;
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('make a model inside the default directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({}));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const validator = new Validator_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        validator.name = 'user';
        await validator.run();
        const UserValidator = await fs.get('app/Validators/UserValidator.ts');
        const ValidatorTemplate = await templates.get('validator.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(UserValidator), (0, test_helpers_1.toNewlineArray)(ValidatorTemplate.replace(new RegExp('\\{{ filename }}', 'g'), 'UserValidator')));
    });
    (0, runner_1.test)('make a validator inside a custom directory', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            namespaces: {
                validators: 'App',
            },
            autoloads: {
                App: './app',
            },
        }));
        const rcContents = (0, fs_extra_1.readJSONSync)((0, path_1.join)(fs.basePath, '.adonisrc.json'));
        const app = new application_1.Application(fs.basePath, 'test', rcContents);
        const validator = new Validator_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        validator.name = 'user';
        await validator.run();
        const UserValidator = await fs.get('app/UserValidator.ts');
        const ValidatorTemplate = await templates.get('validator.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(UserValidator), (0, test_helpers_1.toNewlineArray)(ValidatorTemplate.replace(new RegExp('\\{{ filename }}', 'g'), 'UserValidator')));
    });
});
