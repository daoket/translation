const fly = require('../../utils/wxUtil.js')

let app = getApp();

Page({
  data: {
    meetName: ''
  },
  changeLang(e) {
    if (e.detail.lang === '0') {  // 0中文  1英文
      console.log('选择了中文')
    } else {
      console.log('选择了英文')
    }
  },
  creatMeet() {
    let meetName = this.data.meetName
    if (meetName.length == 0) {
      fly.msg('会议名称不能为空')
    } else {
      let params = {
        meetName: meetName ,
        openid:app.openid
      }
      fly.createkey(params)
        .then(res => {
          console.log(res.key)
          wx.navigateTo({
            url: '../key/index?key=' + res.key + '&meetName=' + meetName
          })
        })
    }
  },
  watchMeetName(e) {
    this.setData({
      meetName: e.detail.value
    })
  },
})