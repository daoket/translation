const CFG = require('./conf.js').CFG

const msg = (title) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

module.exports = {
  // 提示框
  msg: msg,
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
}

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