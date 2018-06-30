// 初始化变量
var audio = null;
var isEnd = true;

/**
 * @desc 语音合成
 * @args text {String} 需要合成的文字
 */
function tts(text) {
  // 调用语音合成接口
  // 参数含义请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
  audio = btts({
    tex: text,
    tok: '24.c31eedd807bdd86586bd165e1e1717c2.2592000.1530954866.282335-9496006',
    spd: 5,
    pit: 5,
    vol: 15,
    per: 4
  }, {
    volume: 0.3,
    autoDestory: true,
    timeout: 10000,
    hidden: false,
    onInit: function(htmlAudioElement) {

    },
    onSuccess: function(htmlAudioElement) {
      audio = htmlAudioElement;
      if (isEnd) {
      	play()
      } else {
        console.log('请在播放完成后点击')
      }
    },
    onError: function(text) {
      alert(text)
    },
    onTimeout: function() {
      alert('timeout')
    }
  });
}

// 播放按钮
function play() {
  if(audio === null) {
    alert('请先点击合成')
  } else {
    isEnd = false;
    audio.play();
  }
}

// 暂停按钮
function pause() {
  if(audio === null) {
    alert('请先点击合成')
  } else {
    audio.pause();
  }
}

// 取消按钮
function cancel() {
  if(audio === null) {
    alert('请先点击合成')
  } else {
    audio.pause();
    document.body.removeChild(audio);
    audio = null;
  }
}

// dom加载完毕回调
function ready(callback) {
  var doc = document;
  if(doc.addEventListener) {
    doc.addEventListener('DOMContentLoaded', function() {
      callback();
    }, false);
  } else if(doc.attachEvent) {
    doc.attachEvent('onreadystatechange', function() {
      if(doc.readyState === 'complete') {
        callback();
      }
    });
  }
}



/**
 * 浏览器调用语音合成接口
 * @param {Object} param 百度语音合成接口参数
 * 请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
 * @param {Object} options 跨域调用api参数
 *           timeout {number} 超时时间 默认不设置为60秒
 *           volume {number} audio控件音量，范围 0-1
 *           hidden {boolean} 是否隐藏audio控件
 *           autoDestory {boolean} 播放音频完毕后是否自动删除控件
 *           onInit {Function} 创建完audio控件后调用
 *           onSuccess {Function} 远程语音合成完成，并且返回音频文件后调用
 *           onError {Function}  远程语音合成完成，并且返回错误字符串后调用
 *           onTimeout {Function} 超时后调用，默认超时时间为60秒
 */
function btts(param, options) {
  var url = 'https://tsn.baidu.com/text2audio';
  var opt = options || {};
  var p = param || {};

  // 如果浏览器支持，可以设置autoplay，但是不能兼容所有浏览器
  var audio = document.createElement('audio');
  if(opt.autoplay) {
    audio.setAttribute('autoplay', 'autoplay');
  }

  // 隐藏控制栏
  if(!opt.hidden) {
    audio.setAttribute('controls', 'controls');
  } else {
    audio.style.display = 'none';
  }

  // 设置音量
  if(typeof opt.volume !== 'undefined') {
    audio.volume = opt.volume;
  }

  // 调用onInit回调
  isFunction(opt.onInit) && opt.onInit(audio);

  // 默认超时时间60秒
  var DEFAULT_TIMEOUT = 60000;
  var timeout = opt.timeout || DEFAULT_TIMEOUT;

  // 创建XMLHttpRequest对象
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  // 创建form参数
  var data = {};
  for(var p in param) {
    data[p] = param[p]
  }

  // 赋值预定义参数
  data.cuid = data.cuid || data.tok;
  data.ctp = 1;
  data.lan = data.lan || 'zh';

  // 序列化参数列表
  var fd = [];
  for(var k in data) {
    fd.push(k + '=' + encodeURIComponent(data[k]));
  }

  // 用来处理blob数据
  var frd = new FileReader();
  xhr.responseType = 'blob';
  xhr.send(fd.join('&'));

  // 用timeout可以更兼容的处理兼容超时
  var timer = setTimeout(function() {
    xhr.abort();
    isFunction(opt.onTimeout) && opt.onTimeout();
  }, timeout);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      clearTimeout(timer);
      if(xhr.status == 200) {
        if(xhr.response.type === 'audio/mp3') {

          // 在body元素下apppend音频控件
          document.body.append(audio);

          audio.setAttribute('src', URL.createObjectURL(xhr.response));

          // autoDestory设置则播放完后移除audio的dom对象
          if(opt.autoDestory) {
            audio.onended = function() {
              document.body.removeChild(audio);
              isEnd = true
            }
          }

          isFunction(opt.onSuccess) && opt.onSuccess(audio);
        }

        // 用来处理错误
        if(xhr.response.type === 'application/json') {
          frd.onload = function() {
            var text = frd.result;
            isFunction(opt.onError) && opt.onError(text);
          };
          frd.readAsText(xhr.response);
        }
      }
    }
  }

  // 判断是否是函数
  function isFunction(obj) {
    if(Object.prototype.toString.call(obj) === '[object Function]') {
      return true;
    }
    return false;
  }
}