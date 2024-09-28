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
        source: 'tsconfig',
        tsConfigPath: './tsconfig.json',
      },
    },
  ],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: webpackConfig => {
      // TypeScript 파일을 처리할 수 있도록 설정
      webpackConfig.resolve.extensions.push('.ts', '.tsx');

      // ts-loader 설정 추가
      webpackConfig.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      });

      return webpackConfig;
    },
  },
};
