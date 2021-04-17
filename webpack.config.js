const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawn = require('child_process').spawn;
const fs = require('fs');
// 获取当前工作目录
const appDirectory = fs.realpathSync(process.cwd());
// 从相对路径中解析绝对路径
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  target: 'electron-renderer',
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: [
            resolveApp('src')
        ],
        use: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
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
    extensions: ['.jsx', '.js'],
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