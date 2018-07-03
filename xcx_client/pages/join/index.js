// pages/join/index.js
const plugin = requirePlugin("WechatSI")
const fly = require('../../utils/wxUtil.js')
let app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    source: '',
    target: '',
  },
  changeLang(e) {
    let cn = this.data.source
    let en = this.data.target
    if (e.detail.lang === '0') {  // 0中文  1英文
      this.setData({
        source: cn,
        target: en
      })
    } else {
      this.setData({
        source: en,
        target: cn
      })
    }
  },
  copyText() {
    
  },
  playText() {
    let self = this
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: self.data.source,
      success: function (res) {
        console.log("succ tts", res.filename)
        // this.playAudio(res.filename)
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    })
  },
  playAudio(src) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = src
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this
    wx.getStorage({
      key: 'source',
      success: function (res) {
        self.setData({
          source: res.data
        })
      }
    })
    wx.getStorage({
      key: 'target',
      success: function (res) {
        self.setData({
          target: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})