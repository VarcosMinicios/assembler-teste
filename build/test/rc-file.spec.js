"use strict";
/*
 * @adonisjs/assembler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("@japa/runner");
const path_1 = require("path");
const dev_utils_1 = require("@poppinss/dev-utils");
const RcFile_1 = require("../src/RcFile");
const fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '__app'));
runner_1.test.group('RcFile', (group) => {
    group.each.teardown(async () => {
        await fs.cleanup();
    });
    (0, runner_1.test)('get an array of meta file patterns from the rcfile', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: ['.env', 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getMetaFilesGlob(), ['.env', 'public/**/*.(css|js)', 'ace']);
    });
    (0, runner_1.test)('get info about a meta file', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [{ pattern: '.env', reloadServer: false }, 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getMetaData('.env'), {
            metaFile: true,
            reload: false,
            testFile: false,
            rcFile: false,
        });
        assert.deepEqual(rcFile.getMetaData('public/foo.js'), {
            metaFile: true,
            reload: true,
            testFile: false,
            rcFile: false,
        });
        assert.deepEqual(rcFile.getMetaData('schema/app.js'), {
            metaFile: false,
            reload: false,
            testFile: false,
            rcFile: false,
        });
    });
    (0, runner_1.test)('match relative paths against meta files', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [{ pattern: '.env', reloadServer: false }, 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isTrue(rcFile.isMetaFile('.env'));
        assert.isTrue(rcFile.isMetaFile('public/style.css'));
        assert.isTrue(rcFile.isMetaFile('public/script.js'));
        assert.isFalse(rcFile.isMetaFile('public/script.sass'));
    });
    (0, runner_1.test)('match relative paths against reloadServer meta files', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [{ pattern: '.env', reloadServer: false }, 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isTrue(rcFile.isRestartServerFile('public/style.css'));
        assert.isTrue(rcFile.isRestartServerFile('public/script.js'));
        assert.isFalse(rcFile.isRestartServerFile('.env'));
    });
    (0, runner_1.test)('filter .adonisrc.json file from files globs array', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [
                '.adonisrc.json',
                { pattern: '.env', reloadServer: false },
                'public/**/*.(css|js)',
            ],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getMetaFilesGlob(), ['.env', 'public/**/*.(css|js)', 'ace']);
    });
    (0, runner_1.test)('filter ace file from files globs array', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: ['ace', { pattern: '.env', reloadServer: false }, 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getMetaFilesGlob(), ['.env', 'public/**/*.(css|js)', 'ace']);
    });
    (0, runner_1.test)('get metadata for files', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [
                '.adonisrc.json',
                { pattern: '.env', reloadServer: false },
                'public/**/*.(css|js)',
            ],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getMetaData('.adonisrc.json'), {
            reload: true,
            rcFile: true,
            testFile: false,
            metaFile: true,
        });
        assert.deepEqual(rcFile.getMetaData('public/style.css'), {
            reload: true,
            rcFile: false,
            testFile: false,
            metaFile: true,
        });
        assert.deepEqual(rcFile.getMetaData('.env'), {
            reload: false,
            rcFile: false,
            testFile: false,
            metaFile: true,
        });
        assert.deepEqual(rcFile.getMetaData('foo/bar.js'), {
            reload: false,
            rcFile: false,
            testFile: false,
            metaFile: false,
        });
    });
    (0, runner_1.test)('match sub paths to the defined command path', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [],
            commands: ['./commands'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isTrue(rcFile.isCommandsPath('commands/foo.ts'));
    });
    (0, runner_1.test)('match actual path to the defined command path', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [],
            commands: ['./commands'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isTrue(rcFile.isCommandsPath('commands.ts'));
    });
    (0, runner_1.test)('do not work when commands refer to path outside the project root', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [],
            commands: ['../commands'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isFalse(rcFile.isCommandsPath('commands.ts'));
        assert.isFalse(rcFile.isCommandsPath('commands/foo.ts'));
    });
    (0, runner_1.test)('do not work when commands refer to a package', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: [],
            commands: ['@adonisjs/foo'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.isFalse(rcFile.isCommandsPath('@adonisjs/foo.ts'));
        assert.isFalse(rcFile.isCommandsPath('@adonisjs/foo/foo.ts'));
    });
    (0, runner_1.test)('read file from the disk by-passing the cache', async ({ assert }) => {
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: ['.env', 'public/**/*.(css|js)'],
        }));
        const rcFile = new RcFile_1.RcFile(fs.basePath);
        assert.deepEqual(rcFile.getDiskContents(), {
            metaFiles: ['.env', 'public/**/*.(css|js)'],
        });
        await fs.add('.adonisrc.json', JSON.stringify({
            metaFiles: ['.env'],
        }));
        assert.deepEqual(rcFile.getDiskContents(), {
            metaFiles: ['.env'],
        });
    });
});
