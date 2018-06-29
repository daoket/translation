import btts from "./baidu_tts_cors";

// 初始化变量
var audio = null;

/**
 * @desc 语音合成
 * @args {String} text 需要合成的文本
 * @args {Object} ttsAudio 音频标签
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
    per: 4,
  }, {
      volume: 0.3,
      autoDestory: true,
      timeout: 10000,
      hidden: false,
      onInit: function (htmlAudioElement) {

      },
      onSuccess: function (htmlAudioElement) {
        audio = htmlAudioElement;
        play()
      },
      onError: function (text) {
        alert(text)
      },
      onTimeout: function () {
        alert('timeout')
      }
    });
}

// 播放按钮
function play() {
  if (audio === null) {
    alert('请先点击合成')
  } else {
    audio.play();
  }
}

// 暂停按钮
function pause() {
  if (audio === null) {
    alert('请先点击合成')
  } else {
    audio.pause();
  }
}

// 取消按钮
function cancel() {
  if (audio === null) {
    alert('请先点击合成')
  } else {
    audio.pause();
    document.body.removeChild(audio);
    audio = null;
  }
}

// dom加载完毕回调
//function ready(callback) {
//var doc = document;
//if(doc.addEventListener) {
//  doc.addEventListener('DOMContentLoaded', function() {
//    callback();
//  }, false);
//} else if(doc.attachEvent) {
//  doc.attachEvent('onreadystatechange', function() {
//    if(doc.readyState === 'complete') {
//      callback();
//    }
//  });
//}
//}

module.exports = tts