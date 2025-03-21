const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/YouTubeVideo/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'YtCustomPlayer',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default', // permite importar sem precisar desestruturar
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // suporta .js e .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // suporta .css
        use: ['style-loader', 'css-loader'], // carrega os arquivos CSS no JavaScript
      },
    ],
  },
  
  resolve: {
    extensions: ['.js', '.jsx'], // facilita a importação sem precisar da extensão
  },
  optimization: {
    minimize: true, // gera uma versão otimizada da lib
  },
  externals: [nodeExternals()],
};
