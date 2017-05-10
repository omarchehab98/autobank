const { join, resolve } = require('path')
const webpack = require('webpack')
const ExtractText = require('extract-text-webpack-plugin')
const SWPrecache = require('sw-precache-webpack-plugin')
const Dashboard = require('webpack-dashboard/plugin')
const Clean = require('clean-webpack-plugin')
const Copy = require('copy-webpack-plugin')
const HTML = require('html-webpack-plugin')

const uglify = require('./uglify')
const babel = require('./babel')

const root = join(__dirname, '..')

module.exports = isProd => {
  // base plugins array
  const plugins = [
    new Clean(['dist'], { root }),
    new Copy([{ context: 'src/client/static/', from: '**/*.*' }]),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
    }),
    new HTML({ template: 'src/client/index.html' }),
    new webpack.LoaderOptionsPlugin({
      options: {
        babel,
        postcss: [
          require('autoprefixer')({ browsers: ['last 3 version'] })
        ]
      }
    })
  ]

  if (isProd) {
    babel.presets.push('babili')

    plugins.push(
      new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
      new webpack.optimize.UglifyJsPlugin(uglify),
      new ExtractText('styles.[hash].css'),
      new SWPrecache({
        cacheId: 'eun',
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 8388608,
        staticFileGlobs: [
          resolve(__dirname, '../src/client/static') + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}'
        ],
        stripPrefix: resolve(__dirname, '../src/client/static'),
        directoryIndex: '/',
        navigateFallback: 'index.html',
        navigateFallbackWhitelist: [/^(?!\/api)/i],
        staticFileGlobsIgnorePatterns: [/\.map$/],
        runtimeCaching: [{
          urlPattern: /\/api\//i,
          handler: 'networkFirst'
        }]
      })
    )
  } else {
    // dev only
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new Dashboard()
    )
  }

  return plugins
}
