const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawn = require('child_process').spawn;

module.exports = {
  target: 'electron-renderer',
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(eot|ttf|ico)$/,
        use: {
          loader: 'file-loader',
          options: {  // 配置
            name: '[name].[ext]', // 以源文件名字及格式输出
            outputPath: 'images/' // 输出到images文件夹下
          }
        }
      },
      {
        test: /\.(svg|jpg|png|gif|ico)$/,
        use: {
          loader: 'url-loader',
          options: { // 配置
            name: '[name].[ext]', // 以源文件名字及格式输出
            outputPath: 'images/', // 输出到images文件夹下
            limit: 10240 // 超过10kb打包为图片
          }
        }
      }
    ]
  },
  devServer: {
    port: 3000,
    after() {
      spawn('npm', ['run', 'start-electron'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@container": path.resolve(__dirname, 'src/container/'),
      "@assets": path.resolve(__dirname, 'assets/'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}