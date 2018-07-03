const fly = require('../../utils/wxUtil.js')

Page({
  data: {
    key: '',
    isRoot: true,
    imgalist: '../../image/qrcode.jpg',
  },

  // 点击识别小程序
  previewImage: function (e) {
    wx.previewImage({
      current: 'https://xz.voicecloud.cn/activity/ai_niu/img/xcx_qrcode.jpg', // 当前显示图片的http链接
      urls: ['https://xz.voicecloud.cn/activity/ai_niu/img/xcx_qrcode.jpg'] // 预览图片http链接列表
    })
  },

  // 开始同声传译
  startMeet() {
    let meetKey = this.data.key
    if (this.data.isRoot) {
      joinMeet(meetKey)
    } else {
      wx.navigateTo({
        url: '../room/index?key=' + meetKey,
      })
    }
    // 加入会议
    function joinMeet(key) {
      if (!key) {
        fly.msg('会议密码不能为空')
        return
      }
      fly.checkkey({ key: key })
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.key) {
      console.log('未获取到会议密码')
      return
    }
    this.setData({
      key: options.key || '',
      meetName: options.meetName || '',
    })
    // 储存会议密码
    wx.setStorage({
      key: 'key',
      data: options.key
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this
    fly.wxLogin().then(openid => {
      fly.msg(openid)
      wx.getStorage({
        key: 'token',
        success: function(res) {
          if (openid == res.data) {
            fly.msg('同一用户')
            self.setData({
              isRoot: true
            })
          } else {
            fly.msg('不同用户')
            self.setData({
              isRoot: false
            })
          }
        },
      })
      
    })
  },
})