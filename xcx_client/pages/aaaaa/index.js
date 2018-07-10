/*
 * @Author: wtniu 
 * @Date: 2018-07-10 17:12:33 
 * @des 插件方法
 * 翻译： plugin.translate 合成： plugin.textToSpeech
 * @des 语音识别管理器 
 * 开始： manager.start 结束： manager.stop 
 * 结束回调： manager.onStop 新内容返回： manager.onRecognize
 */
const app = getApp()
const fly = app.fly

const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    speechBtnText: '长按说话',
    speechText: '',
    translateResult: '',
  },
  onReady: function () {
    // 监听暂定识别事件
    manager.onStop = res => {
      console.log('结束识别')
      let text = res.result
      this.setData({
        speechText: text
      })
      translate(this, text).then(res => {
        textToSpeech(res)
      })
    }
    //有新的识别内容返回触发
    manager.onRecognize = (res) => {
      let text = res.result
      console.log('新的内容：', text)
      this.setData({
        speechText: text
      })
      translate(this, text).then(res => {
        console.log(res)
      })
    }
    initManager()
  },
 // 开始语音识别
  startSpeech(e) {
    start(this)  
  },
 // 结束语音识别
  endSpeech(e) {
    end(this)
  },
})

// ------------------------------- 佛祖镇楼  BUG辟易 -------------------------------  
/**
* @desc 开始逻辑
*/
function start(self) {
  manager.start({
    lang: 'zh_CN',
  })
  self.setData({
    speechBtnText: '正在识别'
  })
}

/**
* @desc 结束逻辑
*/
function end(self) {
  manager.stop()
  self.setData({
    speechBtnText: '长按说话'
  })
}

/**
* @desc 初始化管理器
*/
function initManager() {
  // 识别错误事件
  manager.onError = err => {
    console.log(err)
  }
}

/**
* @desc 翻译逻辑
*/
function translate(self, text) {
  if (text == '') {
    fly.msg('内容不能为空')
    return
  }
  return new Promise(resolve => {
    plugin.translate({
      lfrom: "zh_CN",
      lto: "en_US",
      content: text,
      success: res => {
        if (res.retcode == 0) {
          console.log("翻译结果：", res.result)
          self.setData({
            translateResult: res.result,
          })
          resolve(res.result)
        } else {
          console.warn("翻译失败", res)
        }
      },
      fail: function (res) {
        console.log("网络失败", res)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

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
  innerAudioContext.autoplay = true
  innerAudioContext.src = src
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}