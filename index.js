const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'www')));

let clientSocket;
let cashierSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("CLIENT_CONNECTED", () => {
    clientSocket = socket;
    clientSocket.emit("ACK_CONNECTION");
  })
  
  socket.on("CASHIER_CONNECTED", () => {
  	cashierSocket = socket;
  	cashierSocket.emit("ACK_CONNECTION");
  })
  
  socket.on("TRIGGER_MINIGAME", () => {
  	clientSocket.emit("TRIGGER_MINIGAME");
  })
  
  socket.on("TRIGGER_FAVOURITE", ()=> {
  	clientSocket.emit("TRIGGER_FAVOURITE");
  })
  socket.on("PAGO", ()=> {
  	console.log("FUNCIONA");
    
  })

});

server.listen(3000, () => {
  console.log("Server listening...");
});
