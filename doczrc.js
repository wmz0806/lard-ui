// import { babel } from 'docz-plugin-babel6';
// const autoprefixer = require('autoprefixer');
import {css} from 'docz-plugin-css'


module.exports = {
  // theme: 'src/theme/theme.config.js',
  title: 'L-UI',
  description: '屌咋天',
  debug: false,
  indexHtml: './index.html',
  // host: '0.0.0.0',
  // port: 3000,
  protocol: 'http',
  typescript: true,
  plugins: [
    // babel(),
    css({
      preprocessor: 'postcss',
      // cssmodules: true,
      loaderOpts: {
        // plugins: () => [
        //   require('postcss-flexbugs-fixes'),
        //   autoprefixer({
        //     browsers: ['>1%', 'last 10 versions', 'Firefox ESR', 'not ie < 9'],
        //     flexbox: 'no-2009',
        //   }),
        // ]
      },
      cssOpts: {
      }
    }),
    css({
      preprocessor: 'less',
      // cssmodules: true,
      loaderOpts: {
      },
      cssOpts: {
      }
    })
  ],
  modifyBundlerConfig: (defaultConfig) => {

    // console.log(defaultConfig.module);
    // console.log(defaultConfig.module.rules[2]);
    // console.log(defaultConfig.module.rules[2].use[0].options);
    defaultConfig.module.rules[2].use[0].options.limit = 1;

    // console.log(defaultConfig.module.rules[8].use[1].options);


    // defaultConfig.plugins.pop();

    // defaultConfig.module.rules.push({
    //   include: /node_modules/,
    //   test: /\.css$/,
    //   loader: ['style-loader', 'css-loader']
    // });
    return defaultConfig;
  }
};

