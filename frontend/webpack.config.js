const path = require('path')

const config = {
    entry: ['@babel/polyfill', './src/index.js'],
      output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
      proxy: {
        '/api': { target: 'http://localhost:3001/' },
        '/api': { target: 'http://localhost:3003/' }
      }, // Tämä ohjaa pyynnöt serverin puolelle, jos frontissa ei ole sellaista osoitetta
      historyApiFallback: true // Tämän avulla URL:t toimivat normaalisti myös frontissa
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          },
        },
        { // This allows the use of CSS modules
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true
              }
            }
          ]
        },
      ]
    }
  }

module.exports = config