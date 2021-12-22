import { pathsToModuleNameMapper } from 'ts-jest/utils'

import { compilerOptions } from './tsconfig.json'

export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/config/*.ts',
  ],

  preset: 'ts-jest',
}