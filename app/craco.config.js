const alias = require('craco-alias');
const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @import "@/styles/variables.scss";
        `,
      },
    },
  },
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: alias,
      options: {
        baseUrl: './src',
        source: 'jsconfig',
      },
    },
  ],
};
