const fly = require('../../utils/wxUtil.js')
let app = getApp()

Page({
  data: {
    key: '',
    source: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onReady() {
    // fly.getWebSocketMessage(this)
  },
  testws() {
    fly.sendWebSocketMessage('这是首页测试信息')
  },
  onLoad: function () {
    // 获取token权限，然后获取用户信息
    fly.wxLogin().then(res => {
      wx.setStorage({
        key: 'openid',
        data: res,
      })
      fly.wxGetUserInfo()
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  joinMeet() {
    fly.joinMeet(this.data.key)
  },
  watchKey(e) {
    this.setData({
      key: e.detail.value
    })
  },
})

// -----------------------佛祖镇楼  BUG辟易------------------

/**
 * 接收websocket推送
 * @args {string} url WebSocket接口地址
 * @args {object} self 上下文
 */
function getWebSocketMessage(url, self) {
  return new Promise(resolve => {
    wx.connectSocket({
      url: url,
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
}

