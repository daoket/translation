const path = require('path')
const serve = require("koa-static")
const nunjucks = require('koa-nunjucks-2')
const bodyParser = require("koa-bodyparser")
const session = require('koa-session')

module.exports = (app) => {
  // 设置静态文件托管 
  app.use(serve(path.join(__dirname, "../public")))

  // 配置模板引擎
  app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, '../views'),
    nunjucksConfig: {
      trimBlocks: true
    }
  }));
  
  // 解析post请求
  app.use(bodyParser())

  // 设置session
  app.keys = ['abc'] // 加密cookie，随便填
  app.use(session(app))
}