module.exports = {
  displayName: 'SERVER',
  moduleFileExtensions: ['ts', 'js', 'json'],
  notify: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'ts-jest',
  },
  testEnvironment: 'node',
  globalSetup: './jest/cleanDB.js',
  globalTeardown: './jest/cleanDB.js',
};
