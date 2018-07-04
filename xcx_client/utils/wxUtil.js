const CFG = require('./conf.js').CFG

const fly = {
  msg: msg,
  wxLogin: wxLogin,
  wssurl: CFG.wssurl,
  wxGetUserInfo: wxGetUserInfo,
  /**
   * @desc 获取用户信息
   */
  getwxinfo: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getwxinfo, params, resolve)
    })
  },
  /**
   * @desc 生成会议密码
   */
  createkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.createkey, params, resolve)
    })
  },
  /**
   * @desc 获取会议密码
   */
  getkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getkey, params, resolve)
    })
  },
  /**
   * @desc 校验会议密码是否正确
   */
  checkkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.checkkey, params, resolve)
    })
  },
  /**
   * @desc 保存最新的会议记录
   */
  saveTalk: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.saveTalk, params, resolve)
    })
  },
  /**
   * @desc 获取最新的会议记录
   */
  getTalk: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getTalk, params, resolve)
    })
  },
  /**
   * @desc 根据秘钥获取openID
   */
  getKeyOpenID: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getKeyOpenID, params, resolve)
    })
  },
  /**
   * 进入房间逻辑
   * @args {booblean} key 房间密码
   */
  joinMeet: function (key) {
    isRoot(key).then(isRoot => {
      if (isRoot) {
        // 管理员 直接进入喊麦页面
        wx.navigateTo({
          url: '../room/index?key=' + key
        })
      } else {
        joinNormalRoom(key)
      }
    })
    // 进入普通房间
    function joinNormalRoom(key) {
      fly.checkkey({ key: key }).then(res => {
        if (res.ispass) {
          console.log('密码校验成功')
          wx.navigateTo({
            url: '../join/index?key=' + key
          })
        } else {
          fly.msg('没有查询到该密码，请核对后重新输入。')
        }
      })
    }
    // 判断是否为管理员
    function isRoot(key) {
      return new Promise(resolve => {
        fly.wxLogin().then(openid => {
          fly.getKeyOpenID({ key: key}).then(res => {
            openid == res.openid ? resolve(true) : resolve(false)
          })
        })
      })
    }
  },
  /**
   * 发送webSocket信息
   * @args {string} message 发送的信息
   */
  sendWebSocketMessage: (message) => {
    if (message == '') {
      fly.msg('发送webSocket信息不能为空')
    }
    wx.connectSocket({
      url: CFG.wssurl,
      method: "POST",
      success: res => {
        console.log(res)
      }
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.sendSocketMessage({
        data: message
      })
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
  },
  /**
  * 接收websocket推送
  * @args {object} self 上下文
  */
  getWebSocketMessage: (self) => {
    return new Promise(resolve => {
      wx.connectSocket({
        url: CFG.wssurl,
        method: "POST",
        success: res => {
          console.log(res)
        }
      })
      wx.onSocketMessage(function (res) {
        console.log('收到服务器内容：' + res.data)
        self.setData({
          source: res.data,
        })
        resolve(res.data)
      })
      wx.onSocketClose(function (res) {
        console.log('WebSocket 已关闭！')
      })
      wx.onSocketError(function (res) {
        console.log('WebSocket连接打开失败，请检查！')
      })
    })
  },
}
module.exports = fly


/**
* @desc 小程序请求封装
* @arg {String} url 请求地址
* @arg {object} data 请求数据
*/
function wxAjax(url, data, resolve) {
  wx.request({
      url: url, 
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (data) {
        var _data = data.data;
        if (typeof data == 'string') {
          _data = JSON.parse(data);
        }
        if (_data.errorcode === '000000') {
          resolve(_data.result)
        } else {
          msg('加载异常，请稍后重试')
        }
      },
      fail: (err) => {
        msg('请求出错：', err)
      }
    })
}

/**
 * @desc 提示框
 */
function msg(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

/**
* @desc 微信登录
*/
function wxLogin() {
  return new Promise(resolve => {
    wx.login({
      success: function (res) {
        if (res.code) {
          fly.getwxinfo({ code: res.code })
            .then(res => {
              // console.log(res)
              let session_key = JSON.parse(res).session_key
              let openid = JSON.parse(res).openid
              resolve(openid)
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  })
}
/**
* @desc 获取用户信息
*/
function wxGetUserInfo() {
  return new Promise(resolve => {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  })
}