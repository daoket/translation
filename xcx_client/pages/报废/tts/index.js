// pages/tts/index.js
import tts from '../../vendor/main_tts.js'
Page({
  data: {
    inputVal: '百度语音合成'
  },
  onReady() {
    this.ttsAudio = wx.createAudioContext('ttsAudio')
  },
  tts() {
    console.log(this.data.inputVal)
    tts(this.data.inputVal, this.ttsAudio)
  },
  watchTTSVal(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  test() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = 'https://xz.voicecloud.cn/activity/ai_niu/res/Five-Hundred-Miles.mp3'
    innerAudioContext.autoplay = true
  }
})