const fly = require('../../utils/wxUtil.js')

let app = getApp();

Page({
  data: {
    meetName: ''
  },
  testws() {
    fly.sendWebSocketMessage('这是首页测试信息')
  },
  changeLang(e) {
    if (e.detail.lang === '0') {  // 0中文  1英文
      fly.msg('选择了中文')
    } else {
      fly.msg('选择了英文')
    }
  },
  creatMeet() {
    let meetName = this.data.meetName
    if (meetName.length == 0) {
      fly.msg('会议名称不能为空')
    } else {
      wx.getStorage({
        key: 'openid',
        success: function(res) {
          console.log(res.data)
          create(res.data)
        },
      })
      // 生成会议密码
      function create(openid) {
        let params = {
          meetName: meetName ,
          openid:openid
        }
        fly.createkey(params).then(res => {
          console.log(res.key)
          wx.navigateTo({
            url: '../key/index?key=' + res.key + '&meetName=' + meetName
          })
        })
      }
    }
  },
  watchMeetName(e) {
    this.setData({
      meetName: e.detail.value
    })
  },
})