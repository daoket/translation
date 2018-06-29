
App.age = 1000
App({
  onLaunch: function () {
    console.log('App Launch')
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)        
      }
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
})