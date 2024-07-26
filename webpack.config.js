const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { library } = require('webpack');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'fine-medal.js',
    path: path.resolve(__dirname, 'docs'),
    library: "fineMedal"
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
  },
  //devtool: 'source-map'
};
