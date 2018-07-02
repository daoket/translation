const mongoose = require('mongoose');
const keySchema = require('../schemas')

// 定义一个模型类
module.exports = mongoose.model('key', keySchema)
