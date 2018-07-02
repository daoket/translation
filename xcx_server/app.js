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

middleware(app)
router(app)

mongoose.connect("mongodb://127.0.0.1:27017/face2face", error => {
  if (error) {
    console.log("数据库连接失败：" + error)
  } else {
    console.log("------数据库连接成功！------")
    app.listen(1234, () => {
      console.log('server is running at http://localhost:1234')
    })
  }
});