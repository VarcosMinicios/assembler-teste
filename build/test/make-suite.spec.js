"use strict";
/*
 * @adonisjs/assembler
 *
 * (c) AdonisJS
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
const sink_1 = require("@adonisjs/sink");
const Suite_1 = __importDefault(require("../commands/Make/Suite"));
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('Make Suite', (group) => {
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('Should add suite to RcFile and create sample test', async ({ assert }) => {
        await fs.ensureRoot();
        const app = new application_1.Application(fs.basePath, 'test', {});
        const suiteName = 'my-super-suite';
        const createSuite = new Suite_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        createSuite.suite = suiteName;
        await createSuite.run();
        const sampleTestExist = fs.fsExtra.pathExistsSync((0, path_1.join)(fs.basePath, `tests/${suiteName}/test.spec.ts`));
        assert.isTrue(sampleTestExist);
        const rcFile = new sink_1.files.AdonisRcFile(fs.basePath);
        assert.deepEqual(rcFile.get('tests.suites'), [
            {
                name: suiteName,
                files: [`tests/${suiteName}/**/*.spec(.ts|.js)`],
                timeout: 60000,
            },
        ]);
    });
    (0, runner_1.test)("Shouldn't add suite to RcFile if it already exists", async ({ assert }) => {
        await fs.ensureRoot();
        const app = new application_1.Application(fs.basePath, 'test', {});
        const suiteName = 'my-super-suite';
        const createSuite = new Suite_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        createSuite.suite = suiteName;
        await createSuite.run();
        await createSuite.run();
        await createSuite.run();
        const rcFile = new sink_1.files.AdonisRcFile(fs.basePath);
        assert.deepEqual(rcFile.get('tests.suites'), [
            {
                name: suiteName,
                files: [`tests/${suiteName}/**/*.spec(.ts|.js)`],
                timeout: 60000,
            },
        ]);
    });
    (0, runner_1.test)("Shouldn't add a sample file if specified", async ({ assert }) => {
        await fs.ensureRoot();
        const app = new application_1.Application(fs.basePath, 'test', {});
        const suiteName = 'my-super-suite';
        const createSuite = new Suite_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        createSuite.suite = suiteName;
        createSuite.withExampleTest = false;
        await createSuite.run();
        const sampleTestExist = fs.fsExtra.pathExistsSync((0, path_1.join)(fs.basePath, `tests/${suiteName}/test.spec.ts`));
        assert.isFalse(sampleTestExist);
    });
    (0, runner_1.test)('Custom location - {location}')
        .with([
        { location: 'tests/unit/**.spec.ts', filePath: 'tests/unit/test.spec.ts' },
        { location: 'tests/a/**/*.spec.ts', filePath: 'tests/a/test.spec.ts' },
        {
            location: 'tests/a/b/c/**.spec.ts',
            filePath: 'tests/a/b/c/test.spec.ts',
        },
        {
            location: 'tests/my-tests',
            globPattern: 'tests/my-tests/**/*.spec(.ts|.js)',
            filePath: 'tests/my-tests/test.spec.ts',
        },
        {
            location: '',
            globPattern: 'tests/my-super-suite/**/*.spec(.ts|.js)',
            filePath: 'tests/my-super-suite/test.spec.ts',
        },
    ])
        .run(async ({ assert }, { location, filePath, globPattern }) => {
        await fs.ensureRoot();
        const app = new application_1.Application(fs.basePath, 'test', {});
        const suiteName = 'my-super-suite';
        const createSuite = new Suite_1.default(app, new ace_1.Kernel(app).mockConsoleOutput());
        createSuite.suite = suiteName;
        createSuite.location = location;
        await createSuite.run();
        const sampleTestExist = fs.fsExtra.pathExistsSync((0, path_1.join)(fs.basePath, filePath));
        assert.isTrue(sampleTestExist);
        const rcFile = new sink_1.files.AdonisRcFile(fs.basePath);
        assert.deepEqual(rcFile.get('tests.suites'), [
            {
                name: suiteName,
                files: [globPattern || location],
                timeout: 60000,
            },
        ]);
    });
});
