module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  globals: {
    window: true,
    document: true,
  },
  setupFiles: ['<rootDir>/client/__tests__/__mocks__/localstorage.js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>',
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '**/src/client/**',
  ],
  testMatch: ['**/client/__tests__/**/*.test.js?(x)']
};
