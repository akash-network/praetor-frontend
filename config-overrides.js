// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const {
  override,
  addLessLoader,
  useBabelRc,
  // fixBabelImports,
  addWebpackAlias,
  removeModuleScopePlugin,
  babelInclude,
  addBabelPreset,
  addBabelPlugin,
} = require('customize-cra')

const path = require('path')

// use .eslintrc.js config
const eslintConfig = require('./.eslintrc.js')
const useEslintConfig = (configRules) => (config) => {
  const updatedRules = config.module.rules.map((rule) => {
    // Only target rules that have defined a `useEslintrc` parameter in their options
    if (rule.use && rule.use.some((use) => use.options && use.options.useEslintrc !== void 0)) {
      const ruleUse = rule.use[0]
      const baseOptions = ruleUse.options
      const baseConfig = baseOptions.baseConfig || {}
      const newOptions = {
        useEslintrc: false,
        ignore: true,
        baseConfig: { ...baseConfig, ...configRules },
      }
      ruleUse.options = newOptions
      return rule

      // Rule not using eslint. Do not modify.
    } else {
      return rule
    }
  })

  config.module.rules = updatedRules
  return config
}

module.exports = override(
  useBabelRc(),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        'root-entry-name': 'default',
      },
    },
  }),
  addBabelPreset('@babel/preset-env', { loose: "true "}),
  addBabelPlugin('@babel/plugin-proposal-nullish-coalescing-operator', { loose: "true "}),
  addBabelPlugin('@babel/plugin-syntax-dynamic-import', { loose: "true "}),
  addBabelPlugin('@babel/plugin-transform-private-property-in-object', { loose: "true "}),
  addBabelPlugin('@babel/plugin-transform-class-properties', { loose: "true "}),
  addBabelPlugin('@babel/plugin-transform-private-methods', { loose: "true "}),
  useEslintConfig(eslintConfig),
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve('src'),
    path.resolve('scripts'),
    path.resolve('node_modules/@akashnetwork/akashjs'),
    path.resolve('node_modules/@cosmjs/stargate'),
    path.resolve('node_modules/@cosmjs/proto-signing'),
  ]),
  addWebpackAlias({
    '@scripts': path.resolve(__dirname, 'scripts'),
    ['@perf_hooks']: path.resolve(__dirname, './src/perf_hooks.js'),
    'node:crypto': require.resolve('crypto-browserify'),
  }),
)
