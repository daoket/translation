// pages/join/index.js
const plugin = requirePlugin("WechatSI")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: 'Amid ongoing outrage about the Trump administration’s handling of the separation of more than 2,000 immigrant children from their parents, the departments of Homeland Security and Health and Human Services issued guidance Saturday claiming the government is attempting to reunify the families.',
    target: '在特朗普政府处理将2000多名移民子女与父母分居的处理方面持续愤怒之际，国土安全和卫生与人类服务部门周六发布指导，声称政府正试图使家庭团聚。'
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