
const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require('craco-antd')
const {POSTCSS_MODES} = require('@craco/craco')
module.exports = {
  style: {
    postcss: {
      mode: POSTCSS_MODES.file
    }
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};


