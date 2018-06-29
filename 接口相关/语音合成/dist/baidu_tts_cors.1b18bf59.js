// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
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
  if (opt.autoplay) {
    audio.setAttribute('autoplay', 'autoplay');
  }

  // 隐藏控制栏
  if (!opt.hidden) {
    audio.setAttribute('controls', 'controls');
  } else {
    audio.style.display = 'none';
  }

  // 设置音量
  if (typeof opt.volume !== 'undefined') {
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
  for (var p in param) {
    data[p] = param[p];
  }

  // 赋值预定义参数
  data.cuid = data.cuid || data.tok;
  data.ctp = 1;
  data.lan = data.lan || 'zh';

  // 序列化参数列表
  var fd = [];
  for (var k in data) {
    fd.push(k + '=' + encodeURIComponent(data[k]));
  }

  // 用来处理blob数据
  var frd = new FileReader();
  xhr.responseType = 'blob';
  xhr.send(fd.join('&'));

  console.log(fd.join('&'));

  // 用timeout可以更兼容的处理兼容超时
  var timer = setTimeout(function () {
    xhr.abort();
    isFunction(opt.onTimeout) && opt.onTimeout();
  }, timeout);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      clearTimeout(timer);
      if (xhr.status == 200) {
        if (xhr.response.type === 'audio/mp3') {

          // 在body元素下apppend音频控件
          document.body.append(audio);

          audio.setAttribute('src', URL.createObjectURL(xhr.response));

          // autoDestory设置则播放完后移除audio的dom对象
          if (opt.autoDestory) {
            audio.onended = function () {
              document.body.removeChild(audio);
            };
          }

          isFunction(opt.onSuccess) && opt.onSuccess(audio);
        }

        // 用来处理错误
        if (xhr.response.type === 'application/json') {
          frd.onload = function () {
            var text = frd.result;
            isFunction(opt.onError) && opt.onError(text);
          };
          frd.readAsText(xhr.response);
        }
      }
    }
  };

  // 判断是否是函数
  function isFunction(obj) {
    if (Object.prototype.toString.call(obj) === '[object Function]') {
      return true;
    }
    return false;
  }
}

//module.exports = btts
},{}],6:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50335' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[6,11], null)
//# sourceMappingURL=/baidu_tts_cors.1b18bf59.map