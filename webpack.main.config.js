const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  externals:
    process.env["NODE_ENV"] === "production"
      ? {}
      : {
        sharp: "commonjs sharp",
      },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'templates'),
          to: path.resolve(__dirname, '.webpack', 'main', 'templates')
        },
        {
          from: path.resolve(__dirname, 'src', 'lib', 'dllWin'),
          to: path.resolve(__dirname, '.webpack', 'main', 'dllWin')
        },
        {
          from: path.join(path.dirname(require.resolve('electron-edge-js')), 'native'),
          to: path.resolve(__dirname, '.webpack', 'main', 'native')
        },
      ]
    })
  ],
};
