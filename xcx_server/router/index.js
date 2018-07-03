const router = require('koa-router')()
const controller = require('../controller/index')


module.exports = (app) => {
  router.get('/', controller.index)
  router.post('/getwxinfo', controller.getwxinfo) // 获取微信用户信息
  router.post('/createkey', controller.createkey) // 生成会议密码
  router.post('/getkey', controller.getkey)  // 获取会议密码
  router.post('/checkkey', controller.checkkey) // 检测会议密码是否正确
  router.post('/saveTalk', controller.saveTalk) // 保存最新一条会议记录
  router.post('/getTalk', controller.getTalk) // 获取最新一条会议记录

  app.use(router.routes())
    .use(router.allowedMethods())
}