const fly = require('../../utils/wxUtil.js')

Page({
  data: {
    key: '',
    imgalist: '../../image/qrcode.jpg',
  },
  onReady: function () {
    
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
    fly.joinMeet(this.data.key) // 管理员和观众进入房间
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
})

// -----------------------佛祖镇楼  BUG辟易------------------