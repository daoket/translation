// page/home/pages/room/index.js
import CFG from '../../config'
let translateUrl = CFG.translateUrl
const recorderManager = wx.getRecorderManager()
Page({
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res
      this.setData({
        src: tempFilePath
      })
      // this.audioCtx.play()
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://xz.voicecloud.cn/activity/ai_niu/res/Five-Hundred-Miles.mp3',
  },
  playMusic() {
    this.audioCtx.play()
  },
  /**
   * 开始录音
   */
  startRecoding() {
    recorderManager.start()
  },
  /**
   * 停止录音
   */
  stopRecoding() {
    recorderManager.stop()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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