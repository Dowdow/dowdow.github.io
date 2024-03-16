const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.jsx'),
    'service-worker': path.resolve(__dirname, './src/service-worker.js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new WebpackAssetsManifest(),
  ],
  devtool: 'eval-source-map',
};
