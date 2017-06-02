const {join, resolve} = require('path')
const ExtractText = require('extract-text-webpack-plugin')
const setup = require('./setup')

const dist = join(__dirname, '../dist')
const exclude = /(node_modules|bower_components)/

module.exports = env => {
  const isProd = env && env.production

  return {
    entry: {
      app: './src/client/index.js',
      vendor: [
        'react',
        'react-dom',
        'react-tap-event-plugin',
        'react-router-dom',
        'prop-types',
        'material-ui',
        'moment',
        'react-chartjs-2',
        'chart.js'
      ]
    },
    output: {
      path: dist,
      filename: '[name].[hash].js',
      publicPath: '/'
    },
    resolve: {
      alias: {
        // 'react': 'preact-compat',
        // 'react-dom': 'preact-compat',
        'views': resolve(__dirname, '../src/client/views')
      }
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: exclude,
        loader: 'babel-loader'
      }, {
        test: /\.(sass|scss)$/,
        loader: isProd ? ExtractText.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!postcss-loader!sass-loader'
        }) : 'style-loader!css-loader!postcss-loader!sass-loader'
      }]
    },
    plugins: setup(isProd),
    devtool: !isProd && 'eval',
    devServer: {
      contentBase: dist,
      host: '0.0.0.0',
      port: process.env.PORT || 3000,
      historyApiFallback: true,
      compress: isProd,
      inline: !isProd,
      hot: !isProd
    }
  }
}
