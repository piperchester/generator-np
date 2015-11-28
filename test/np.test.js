import path from 'path';
import yeomanGenerator from 'yeoman-generator';
import assert from 'yeoman-assert';
import test from 'ava';

const helpers = yeomanGenerator.test;
const tempDir = path.join(__dirname, '.temp');
const deps = ['../../app'];

function run(prompt) {
  return new Promise((resolve, reject) => {
    helpers.testDirectory(tempDir, err => {
      if (err) {
        reject(err);
        return;
      }

      const generator = helpers.createGenerator('np:app', deps, null, {
        skipInstall: true
      });

      helpers.mockPrompt(generator, prompt);

      generator.run(resolve);
    });
  });
}

test('generates expected files', () => {
  const expected = [
    '.babelrc',
    '.editorconfig',
    '.eslintrc',
    '.gitignore',
    '.istanbul.yml',
    '.travis.yml',
    'src/lib/index.js',
    'test/setup.js',
    'test/test.test.js',
    'package.json',
    'README.md'
  ];

  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    website: 'test.com',
    cli: false
  }).then(() => {
    assert.file(expected);
    assert.noFile('cli.js');
  });
});

test('no travis', () => {
  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    website: 'test.com',
    travis: false
  }).then(() => {
    assert.noFile('.travis.yml');
    assert.noFileContent('package.json', /coveralls/);
    assert.noFileContent('README.md', /coveralls/);
  });
});

test('travis + no coveralls', () => {
  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    website: 'test.com',
    travis: true,
    coveralls: false
  }).then(() => {
    assert.noFileContent('package.json', /coveralls/);
    assert.noFileContent('README.md', /coveralls/);
    assert.noFileContent('.travis.yml', /coveralls/);
  });
});

test('no commitizen', () => {
  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    commitizen: false
  }).then(() => {
    assert.noFileContent('package.json', /cz-conventional-changelog/);
    assert.noFileContent('README.md', /Commitizen friendly/);
  });
});

test('center', () => {
  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    website: 'test.com',
    center: true
  }).then(() => {
    assert.fileContent('README.md', /<big><h1/);
  });
});

test('cli', () => {
  return run({
    moduleName: 'test',
    moduleDescription: 'My awesome module description',
    githubUsername: 'test',
    website: 'test.com',
    cli: true
  }).then(() => {
    assert.file('src/cli.js');
    assert.fileContent('package.json', /"bin":/);
    assert.fileContent('package.json', /"bin": "cli.js"/);
    assert.fileContent('package.json', /"meow"/);
  });
});
