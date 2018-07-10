const app = getApp()
const fly = app.fly

const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    speechBtnText: '长按说话',
    speechText: '',
    translateResult: '',
  },
  onReady: function () {
    // 监听暂定识别事件
    manager.onStop = res => {
      let text = res.result
      this.setData({
        speechText: text
      })
      this.translate(text)
    }
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      console.log(text)
      fly.msg('新的内容', text)
    }
    // 识别错误事件
    manager.onError = err => {
      console.log(err)
    }
  },
 // 开始语音识别
  startSpeech(e) {
    manager.start({
      lang: 'zh_CN',
    })
    
    // 轮询识别
    setInterval(() => {
      fly.msg('重新识别')
      manager.stop()
    }, 3000);

    this.setData({
      speechBtnText: '正在识别'
    })
  },
 // 结束语音识别
  endSpeech(e) {
    manager.stop()
    this.setData({
      speechBtnText: '长按说话'
    })
  },
  translate(text) {
    if (text == ''){
      fly.msg('内容不能为空')
      return
    }
    plugin.translate({
      lfrom: "zh_CN",
      lto: "en_US",
      content: text,
      success: res => {
        if (res.retcode == 0) {
          console.log("翻译结果：", res.result)
          this.setData({
            translateResult: res.result,
          })
          textToSpeech(res.result)
        } else {
          console.warn("翻译失败", res)
        }
      },
      fail: function (res) {
        console.log("网络失败", res)
      }
    })
  },
  // 检测翻译内容
  watchTranslateText(e) {
    this.setData({
      translateText: e.detail.value
    })
  },
})

/**
* @desc 合成
* @arg speechText 合成内容
*/
function textToSpeech(speechText) {
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: speechText,
    success: function (res) {
      console.log("succ tts", res.filename)
      // 播放合成音频
      playAudio(res.filename)
    },
    fail: function (res) {
      console.log("fail tts", res)
    }
  })
}

/**
* @desc 播放音频
*/
function playAudio(src) {
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
  manager.start({
    lang: 'zh_CN',
  })
}