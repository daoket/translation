let ws = new WebSocket('ws://localhost:1234/ws/talk');
ws.onopen = e => {console.log('client open', e)}
ws.onclose = e => {console.log('client close', e)}
ws.onerror = err => {console.log('client err', err)}
ws.onmessage = msg => {console.log(msg)}

$('button').on('click', () => {
  console.log('向服务器发送信息')
  ws.send('今天天气真不错123');
});


// let data = {name: 'iwen', age:18}
// let url = 'http://localhost:1234/data'
// $.ajax({
//   type: "post",
//   url: url,
//   async: true,
//   data: {
//     "name": "iwen"
//   },
//   success: function (res) {
//     console.log(res)
//   }
// });