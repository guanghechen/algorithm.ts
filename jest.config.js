const { tsMonorepoConfig } = require('@guanghechen/jest-config')

const baseConfig = tsMonorepoConfig(__dirname)

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 100,
      lines: 100,
      statements: 95,
    },
  },
}
