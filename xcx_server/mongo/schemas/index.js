const mongoose = require("mongoose")

// 定义一个表
module.exports = new mongoose.Schema({
  key: String,
  openid: String,
})
