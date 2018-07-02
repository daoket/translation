const router = require('koa-router')()
const controller = require('../controller/index')


module.exports = (app) => {
  router.get('/', controller.index)
  router.post('/getwxinfo', controller.getwxinfo)
  router.post('/createkey', controller.createkey)
  router.post('/getkey', controller.getkey)
  router.post('/checkkey', controller.checkkey)

  app.use(router.routes())
    .use(router.allowedMethods())
}