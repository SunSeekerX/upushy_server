/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-14 17:11:32
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-11 14:04:58
 */

module.exports = {
  apps: [
    {
      name: 'uni-pushy-server',
      script: 'dist/main.js',
      watch: false,
      min_uptime: '60s',
      max_restarts: 3,
      // log 顯示時間
      time: true,
      // 錯誤 log 的指定位置
      error_file: './logs/err.log',
      // 正常輸出 log 的指定位置
      out_file: './logs/app.log',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
