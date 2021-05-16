const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appFlavour: 'Corteza Reporter',
  appName: 'reporter',
  appLabel: 'Corteza Reporter Editor',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-reporter',
})
