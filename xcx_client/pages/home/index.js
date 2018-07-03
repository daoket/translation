const fly = require('../../utils/wxUtil.js')
let app = getApp()

Page({
  data: {
    key: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 获取token权限，然后获取用户信息
    fly.wxLogin().then(res => {
      wx.setStorage({
        key: 'token',
        data: res,
      })
      fly.wxGetUserInfo()
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  joinMeet() {
    let key = this.data.key
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
          fly.msg('没有查询到该密码，请核对后重新输入。')
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

