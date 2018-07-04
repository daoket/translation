// pages/join/index.js
const plugin = requirePlugin("WechatSI")
const fly = require('../../utils/wxUtil.js')
let app = getApp()

Page({
  data: {
    meetKey: '',
    source: '',
    target: '',
    lang: 1, // 默认翻译为中文 0中文  1英文
  },
  onReady: function () {
    // wx.hideShareMenu()  // 隐藏分享
    getTalkHistory(this.data.meetKey, this) // 初始化页面获取谈话记录
    // 接收websocket推送
    fly.getWebSocketMessage(this).then(res => { 
      fly.msg('接收到来自服务器的推送：', res)
      translate(res, this.data.lang, this) 
    }) 
  },
  changeLang(e) {
    translate(this.data.source, e.detail.lang, this) 
  },
  copyText() {
    fly.msg('该功能还在开发中 🔨🔨🔨！')
  },
  playText() {
    textToSpeech(this.data.target)
  },
  onLoad: function (options) {
    this.setData({
      meetKey: options.key || ''
    })
  },
})

// -----------------------佛祖镇楼  BUG辟易------------------

/**
 * 获取会议记录
 * @args {string} meetKey 会议密码
 * @args {object} self 上下文
 */
function getTalkHistory(meetKey, self) {
  let getTalkParams = {
    key: meetKey,
    // key: 'CIp7njic',  
  }
  fly.getTalk(getTalkParams).then(res => {
    // console.log(res)
    if (res.isGet) {
      self.setData({
        source: res.source,
        target: res.target
      })
    } else {
      fly.msg('会议密码错误')
      return
    }
  })
}

/**
 * 文本翻译
 * @args {string} content 需要翻译的内容
 * @args {number} lang 翻译的语言
 * @args {object} self 上下文
 */
function translate(content, lang, self) {
  let lfrom = ''
  let lto = ''
  if(typeof lang == 'string') {
    lang = +lang
  }
  if (content == '') {
    fly.msg('翻译内容不能为空')
    return
  }
  switch (lang) {
    case 0:
      lfrom = 'en_US'
      lto = 'zh_CN'
      break;
    case 1:
      lfrom = 'zh_CN'
      lto = 'en_US'
      break;
  }
  plugin.translate({
    lfrom: lfrom,
    lto: lto,
    content: content,
    success: function (res) {
      if (res.retcode == 0) {
        console.log("result", res.result)
        fly.msg("result", res.result)
        self.setData({
          target: res.result,
        })
      } else {
        console.warn("翻译失败", res)
      }
    },
    fail: function (res) {
      console.log("网络失败", res)
    }
  })
}

/**
 * 文本播报
 * @args {string} content 需要翻译的内容
 */
function textToSpeech(content) {
  if (content === '') {
    fly.msg('当前还没有需要播放的文字')
    return
  }
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: content,
    success: function (res) {
      console.log("succ tts", res.filename)
      playAudio(res.filename) // 播放音频
    },
    fail: function (res) {
      console.log("fail tts", res)
    }
  })
}

/**
 * 播放音频
 * @args {string} src 需要播放的音频地址
 */
function playAudio(src) {
  if (src == '' || typeof src !== 'string') {
    fly.msg('音频链接无效')
  }
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
}