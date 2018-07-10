/**
* 应用程序的入口文件
* Created by wtniu on 2018-07-01.
* Copyright 2018 wtniu. All rights reserved.
*/
const Koa = require('koa')
const app = new Koa()
const mongoose = require("mongoose")
const router = require('./router')
const middleware = require('./middleware')
const ws = require('./middleware/ws')

middleware(app)
router(app)

let debug = true
if (debug) {
  let server = app.listen(1234, () => {
    console.log('Server is 🏃‍  at: http://127.0.0.1:%s', server.address().port);
  });
  ws(server) // 注册websocket
} else {
  mongoose.connect("mongodb://127.0.0.1:27017/face2face", error => {
    if (error) {
      console.log("数据库连接失败：" + error)
    } else {
      console.log("------数据库连接成功！------")
      let server = app.listen(1234, () => {
        console.log('Server is 🏃‍  at: http://127.0.0.1:%s', server.address().port);
      });
      ws(server) // 注册websocket
    }
  });
}
