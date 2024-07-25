const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.glsl$/i,
        use: 'raw-loader',
      },
    ]
  },
  plugins: [],
  devServer: {
    static: path.join(__dirname, 'docs'),
    compress: true,
    port: 9000
  }
};
