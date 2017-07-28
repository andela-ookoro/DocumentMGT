module.exports = {
  moduleFileExtensions: [ 'es6', 'js', 'jsx'],
  globals: {
    window: true,
    document: true,
  },
  setupFiles: [
    '<rootDir>/client/__tests__/__mocks__/localstorage.js',
    '<rootDir>/client/__tests__/__mocks__/jqueryMock.js'
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>',
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '**/src/client/(components|actions|reducers)/**',
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/jqueryMock.js",
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  unmockedModulePathPatterns: [
    "node_modules/react/",
    "node_modules/enzyme/"
  ],
  transform: {
    ".*": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: "jsdom",
  setupTestFrameworkScriptFile: "jest-environment-jsdom",
  testMatch: ['**/client/__tests__/(components|actions|reducers)/*.test.js?(x)'],
  verbose: true,
  bail: true
};

