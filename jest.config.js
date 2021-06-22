/* eslint-disable unicorn/prefer-module */

module.exports = {
  roots: ['<rootDir>/code', '<rootDir>/infra'],
  testMatch: ['**/*.{spec,test}.{js,ts}'],
  testEnvironment: 'node',

  setupFiles: [
    // :: load .env values
    'dotenv/config',
  ],

  transform: {
    // :: pipe typescript (.ts,.tsx) files through `ts-jest`
    '^.+\\.tsx?$': 'ts-jest',
  },

  // :: make sure this matches the `paths` setting in tsconfig.json
  moduleNameMapper: {
    '^@code/(.*)$': '<rootDir>/code/$1',
    '^@constructs/(.*)$': '<rootDir>/infra/constructs/$1',
    '^@stacks/(.*)$': '<rootDir>/infra/stacks/$1',
  },

  globals: {
    'ts-jest': {
      isolatedModules: false,
    },
  },
}
