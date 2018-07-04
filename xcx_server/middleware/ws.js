const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server: server,
    // port: 3000,  两种方式都可以
  });

  // Broadcast to all.
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on('connection', function connection(ws) {
    console.log('ws connection')
    // ws.send('这是服务端发送的测试信息')
    ws.on('message', function incoming(data) {
      console.log('服务器收到的信息：', data)
      // Broadcast to everyone else.
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });
  console.log(`ws server started at port ${server.address().port}...`);
}