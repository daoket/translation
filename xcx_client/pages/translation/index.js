import CFG from '../../config'
let translateUrl = CFG.translateUrl
Page({
  onReady: function (e) {
  },
  data: {
    inputVal: '',
    ouputVal: '',
  },
  translation() {
    let self = this
    let inputVal = self.data.inputVal
    console.log('需要翻译的值：', inputVal)
    wx.request({
      url: translateUrl + inputVal,
      success: res => {
        let result = res.data.translation[0]
        console.log('翻译结果：', result)
        self.setData({
          ouputVal: result
        })
      }
    })
  },
  watchTranslateVal(e) {
    this.setData({
      inputVal: e.detail.value
    })
  }
})