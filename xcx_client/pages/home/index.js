const fly = require('../../utils/wxUtil.js')

let app = getApp()

Page({
  data: {
    key: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  joinMeet() {
    let key = this.data.key || 'gMSNU7Ph'
    if (!key) {
      fly.msg('会议密码不能为空')
      return
    }
    fly.checkkey({ key: key})
      .then(res => {
        if (res.ispass) {
          console.log('密码校验成功')
          wx.navigateTo({
            url: '../join/index?key=' + key
          })
        } else {
          fly.msg('密码校验失败')
        }
      })
    // checkkey(key)
  },
  watchKey(e) {
    this.setData({
      key: e.detail.value
    })
  },
  onReady() {
    let key = this.data.key
    
  }
})