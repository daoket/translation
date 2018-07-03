const fly = require('../../utils/wxUtil.js')

let app = getApp();

Page({
  data: {
    lang: ['中文', '英文'],
    langArray: [
      {id: 0,name: '中文'},
      {id: 1,name: '英文'}
    ],
    index: 0,
    meetName: ''
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
              url: '../key/index?key=' + res.key
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