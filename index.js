var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))
var CLIENTS=[];
var id;
var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {

  id = Math.random();
  console.log('connection is established : ' + id);
  CLIENTS[id] = ws;
  CLIENTS.push(ws);

  ws.on('message', function(message) {
      console.log('received: %s', message);
    
      sendAll(message); // broadcast messages to everyone including sender

  });
  ws.on('close', function() {
          console.log('user ' + id + ' left Server');
          delete CLIENTS[id];
      });

})
function sendAll(message) {
    console.log('sendAll : ');
    for (var j=0; j < CLIENTS.length; j++) {
        // Отправить сообщения всем, включая отправителя
        console.log('FOR : ', message);
        CLIENTS[j].send(message);
    }
}
