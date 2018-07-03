const CFG = require('./conf.js').CFG

const fly = {
  msg: msg,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  /**
   * @desc 获取用户信息
   */
  getwxinfo: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getwxinfo, params, resolve)
    })
  },
  /**
   * @desc 生成会议密码
   */
  createkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.createkey, params, resolve)
    })
  },
  /**
   * @desc 获取会议密码
   */
  getkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getkey, params, resolve)
    })
  },
  /**
   * @desc 校验会议密码是否正确
   */
  checkkey: (params={}) => {
    return new Promise(resolve => {
      wxAjax(CFG.checkkey, params, resolve)
    })
  },
  /**
   * @desc 保存最新的会议记录
   */
  saveTalk: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.saveTalk, params, resolve)
    })
  },
  /**
   * @desc 获取最新的会议记录
   */
  getTalk: (params = {}) => {
    return new Promise(resolve => {
      wxAjax(CFG.getTalk, params, resolve)
    })
  },
}
module.exports = fly

/**
* @desc 小程序请求封装
* @arg {String} url 请求地址
* @arg {object} data 请求数据
*/
function wxAjax(url, data, resolve) {
  wx.request({
      url: url, 
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (data) {
        var _data = data.data;
        if (typeof data == 'string') {
          _data = JSON.parse(data);
        }
        if (_data.errorcode === '000000') {
          resolve(_data.result)
        } else {
          msg('加载异常，请稍后重试')
        }
      },
      fail: (err) => {
        msg('请求出错：', err)
      }
    })
}

/**
 * @desc 提示框
 */
function msg(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

/**
* @desc 微信登录
*/
function wxLogin() {
  return new Promise(resolve => {
    wx.login({
      success: function (res) {
        if (res.code) {
          fly.getwxinfo({ code: res.code })
            .then(res => {
              // console.log(res)
              let session_key = JSON.parse(res).session_key
              let openid = JSON.parse(res).openid
              resolve(openid)
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  })
}
/**
* @desc 获取用户信息
*/
function wxGetUserInfo() {
  return new Promise(resolve => {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  })
}