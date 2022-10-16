/* eslint-disable no-param-reassign */
const path = require('path');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const addLessLoader = require("customize-cra-less-loader");
const {
  override,
  addWebpackPlugin,
  fixBabelImports,
  removeModuleScopePlugin,
} = require('customize-cra');
const Dotenv = require('./config-env');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  (config, env) => {
    config = rewireReactHotLoader(config, env);
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };
    return config;
  },
  addLessLoader({
    cssLoaderOptions: {
      sourceMap: true,
      modules: {
        localIdentName: "[hash:base64:8]",
      },
    },
    lessLoaderOptions: {
      lessOptions: {
        strictMath: false,
        javascriptEnabled: true,
      },
    },
  }),
  addWebpackPlugin(new Dotenv()),
  removeModuleScopePlugin(),
);
