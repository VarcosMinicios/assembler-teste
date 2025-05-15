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
const execa_1 = __importDefault(require("execa"));
const path_1 = require("path");
const dev_utils_1 = require("@poppinss/dev-utils");
const api_1 = require("@poppinss/cliui/build/api");
const Compiler_1 = require("../src/Compiler");
const test_helpers_1 = require("../test-helpers");
const ui = (0, api_1.instantiate)(true);
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('Compiler', (group) => {
    group.setup(() => {
        ui.logger.useRenderer(ui.testingRenderer);
    });
    group.each.teardown(() => {
        ui.testingRenderer.logs = [];
    });
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('build source files', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {},
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/.adonisrc.json',
            'build/ace',
            'build/src/foo.js',
            'build/public/styles/main.css',
            'build/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
        assert.isFalse(require((0, path_1.join)(fs.basePath, 'build', '.adonisrc.json')).typescript);
    }).timeout(0);
    (0, runner_1.test)('build source files with explicit outDir', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                outDir: 'build',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/.adonisrc.json',
            'build/src/foo.js',
            'build/public/styles/main.css',
            'build/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('build source files with explicit rootDir', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/.adonisrc.json',
            'build/src/foo.js',
            'build/public/styles/main.css',
            'build/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('build source files to nested outDir', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build/dist"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build/dist')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build/dist')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('do not build when config has errors', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                foo: 'bar',
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import path from 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.error}  unable to parse tsconfig.json`,
                stream: 'stderr',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('catch and report typescript errors', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import path from 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile(false);
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build/dist"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.error}  typescript compiler errors`,
                stream: 'stderr',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build/dist')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build/dist')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('do not continue on error', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import path from 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile(true);
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build/dist"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.error}  typescript compiler errors`,
                stream: 'stderr',
            },
            {
                message: '',
                stream: 'stderr',
            },
            {
                message: `bgRed(Cannot complete the build process as there are typescript errors. Use "--ignore-ts-errors" flag to ignore Typescript errors)`,
                stream: 'stderr',
            },
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build/dist"')} directory`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('do not emit when noEmitOnError is true', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
                noEmitOnError: true,
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import path from 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build/dist"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.warning}  typescript emit skipped`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.error}  typescript compiler errors`,
                stream: 'stderr',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('build for production should copy package files to build folder', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('package.json', JSON.stringify({
            name: 'my-dummy-app',
            dependencies: {
                lodash: 'latest',
            },
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                outDir: 'build',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        await (0, execa_1.default)('npm', ['install'], {
            buffer: false,
            cwd: fs.basePath,
            stdio: 'inherit',
        });
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compileForProduction(false, 'npm');
        const hasFiles = await Promise.all([
            'build/.adonisrc.json',
            'build/src/foo.js',
            'build/public/styles/main.css',
            'build/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, true, true]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace,package.json,package-lock.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
            {
                message: '',
                stream: 'stdout',
            },
        ]);
        const hasPackageLock = await fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, 'build', 'package-lock.json'));
        assert.isTrue(hasPackageLock);
    }).timeout(0);
    (0, runner_1.test)('gracefully log error when ace file finishes with non-zero exit code', async ({ assert, }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {},
        }));
        await fs.add('ace', "console.error('foo');process.exit(1)");
        await fs.add('src/foo.ts', '');
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all([
            'build/.adonisrc.json',
            'build/ace',
            'build/src/foo.js',
            'build/public/styles/main.css',
            'build/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/**/*.(js|css),ace => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.warning}  Unable to generate manifest file. Check the following error for more info`,
                stream: 'stdout',
            },
            {
                message: 'foo',
                stream: 'stderr',
            },
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
        ]);
        assert.isFalse(require((0, path_1.join)(fs.basePath, 'build', '.adonisrc.json')).typescript);
    }).timeout(0);
    (0, runner_1.test)('ignore error when any of the meta file is missing', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/css/app.js'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {},
        }));
        await fs.add('src/foo.ts', '');
        await fs.add('ace', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        await compiler.compile();
        const hasFiles = await Promise.all(['build/.adonisrc.json', 'build/ace', 'build/src/foo.js', 'build/public/css/app.js'].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        ui.testingRenderer.logs.pop();
        assert.deepEqual(hasFiles, [true, true, true, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  cleaning up ${(0, test_helpers_1.dimYellow)('"./build"')} directory`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  compiling typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('public/css/app.js,ace => build')} }`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.info}  copy { ${(0, test_helpers_1.dimYellow)('.adonisrc.json => build')} }`,
                stream: 'stdout',
            },
        ]);
        assert.isFalse(require((0, path_1.join)(fs.basePath, 'build', '.adonisrc.json')).typescript);
    }).timeout(0);
    (0, runner_1.test)('build should support custom tsconfig file', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
        }));
        await fs.add('package.json', JSON.stringify({
            name: 'my-dummy-app',
            dependencies: {},
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                outDir: 'build',
            },
        }));
        await fs.add('tsconfig.production.json', JSON.stringify({
            extends: './tsconfig.json',
            exclude: ['build', 'src/ignored.ts'],
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', '');
        await fs.add('src/ignored.ts', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger, 'tsconfig.production.json');
        await compiler.compileForProduction(false, 'npm');
        const hasFiles = await Promise.all(['build/.adonisrc.json', 'build/src/foo.js', 'build/src/ignored.js'].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [true, true, false]);
    }).timeout(0);
    (0, runner_1.test)('typecheck and report typescript errors', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import path from 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        const isValid = await compiler.typeCheck();
        assert.isFalse(isValid);
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  type checking typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.error}  typescript compiler errors`,
                stream: 'stderr',
            },
        ]);
    }).timeout(0);
    (0, runner_1.test)('complete successfully when typechecking has no errors', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            typescript: true,
            metaFiles: ['public/**/*.(js|css)'],
        }));
        await fs.add('tsconfig.json', JSON.stringify({
            include: ['**/*'],
            exclude: ['build'],
            compilerOptions: {
                rootDir: './',
                outDir: 'build/dist',
            },
        }));
        await fs.add('ace', '');
        await fs.add('src/foo.ts', "import 'path'");
        await fs.add('public/styles/main.css', '');
        await fs.add('public/scripts/main.js', '');
        const compiler = new Compiler_1.Compiler(fs.basePath, [], false, ui.logger);
        const isValid = await compiler.typeCheck();
        assert.isTrue(isValid);
        const hasFiles = await Promise.all([
            'build/dist/.adonisrc.json',
            'build/dist/src/foo.js',
            'build/dist/public/styles/main.css',
            'build/dist/public/scripts/main.js',
        ].map((file) => fs.fsExtra.pathExists((0, path_1.join)(fs.basePath, file))));
        assert.deepEqual(hasFiles, [false, false, false, false]);
        assert.deepEqual(ui.testingRenderer.logs, [
            {
                message: `${test_helpers_1.info}  type checking typescript source files`,
                stream: 'stdout',
            },
            {
                message: `${test_helpers_1.success}  built successfully`,
                stream: 'stdout',
            },
        ]);
    }).timeout(0);
});
