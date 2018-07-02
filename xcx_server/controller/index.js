const CryptoJS = require("crypto-js")
const Key = require('../mongo/models')
const request = require('request');


let resData = {
  "errorcode": "000000",
  "desc": "成功",
  "status": "success",
  "result": {}
}

module.exports = {
  index: async(ctx, next) => {
    await ctx.render("main/index", {title: "欢迎您"})
  },
  getwxinfo: async (ctx, next) => {
    return new Promise(resolve => {
      let code = ctx.request.body.code
      let getTokenUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wxe43f9fbc8ef7d00f&secret=096a6f8c2a3d8fc712b08c65a7ee0ef2&js_code=${code}&grant_type=authorization_code`
      request(getTokenUrl, (err, req, res) => {
        resData.result = res
        ctx.body = resData
        resolve(next())
      })
    })
  },
  /**
  * @desc 生成会议密码
  */
  createkey: async (ctx, next) => {
    let data = ctx.request.body
    let key = await saveKey(data)
    if (key.length === 8) {
      resData.result = {
        "key": key
      }
      ctx.body = resData
    } else {
      resData.errorcode = '006000'
      resData.result = {
        "message": "密码生成失败"
      }
      ctx.body = resData
    }
  },
  /**
  * @desc 获取会议密码
  */
  getkey: async (ctx, next) => {
    let data = ctx.request.body
    ctx.body = {name: 'iwen'};
  },
  /**
  * @desc 校验会议密码是否正确
  */
  checkkey: async (ctx, next) => {
    let data = ctx.request.body
    if (true) {
      resData.result = {
        "message": "密码校验成功"
      }
      ctx.body = resData
    } else {
      resData.errorcode = '006000'
      resData.result = {
        "message": "密码校验失败"
      }
      ctx.body = resData
    }
  },
}

/**
 * @desc Aes加密
 */
function encryptByAes(word, secret='xcxf2f') {
  var secretKey = CryptoJS.MD5(secret).toString().substr(8, 16);
  var key = CryptoJS.enc.Utf8.parse(secretKey);
  var iv = key; //CryptoJS.enc.Utf8.parse(secretKey);
  var encrypted = '';
  if (typeof (word) == 'string') {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } else if (typeof (word) == 'object') { //对象格式的转成json字符串
    data = JSON.stringify(word);
    var srcs = CryptoJS.enc.Utf8.parse(data);
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  }
  return new Promise(resolve => {
    resolve(encrypted.toString().substr(0, 8))
  })
}

/**
 * @desc 保存到数据库中
 */
function saveKey(data) {
  return new Promise(resolve => {
    let content = data.meetName + Math.random()
    encryptByAes(content).then(key => {
      // 查询数据库是否重复
      Key.findOne({
        key: key
      }).then((keyInfo) => {
        if (keyInfo) {
          saveKey(data.meetName)
          return
        }
        var newKey = new Key({
          key: key,
          openid: data.openid
        })
        return newKey.save()
      }).then((newkeyInfo) => {
        resolve(newkeyInfo.key)
      })
    })
  })
}