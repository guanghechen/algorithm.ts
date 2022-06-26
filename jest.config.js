const { tsMonorepoConfig } = require('@guanghechen/jest-config')

const baseConfig = tsMonorepoConfig(__dirname)

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
}
