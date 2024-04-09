const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');	
const crypto = require("crypto");

app.use('/', express.static(path.join(__dirname, 'www')));

let cashierSocket;
var keys;

read_keys();

function read_keys() {
	fs.readFile("./data_user/keys.json", "utf-8", (err, data) => {
		if (err) {
			console.log(err);
		}
		else {
			keys = JSON.parse(data);
		}
	});
}

function write_keys() {
	fs.writeFile("./data_user/keys.json", JSON.stringify(keys), (err) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log("Usuario añadido");
		}
	});
}

function find_in_keys(socket, data) {
	let user_pwd = keys[data["user"]];
	if (user_pwd == null) {
		socket.emit("LOG_IN_RESPONSE", -1);
		return ;
	};
	
	let b64_pwd = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	
	if (user_pwd != b64_pwd) {
		socket.emit("LOG_IN_RESPONSE", -2);
		return ;
	};
	
	socket.emit("LOG_IN_RESPONSE", 0);
}

function add_user(socket, data) {
	if (keys[data["user"]] != null) {
		socket.emit("SIGN_UP_RESPONSE", -1);
		return ;
	}
	
	// Cambiar esta línea para cambiar el JSON
	keys[data["user"]] = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	write_keys();
	socket.emit("SIGN_UP_RESPONSE", 0);
}

io.on('connection', (socket) => {
	console.log("socket connected, id: " + socket.id);

  socket.on("CLIENT_CONNECTED", () => {
    socket.emit("ACK_CONNECTION");
  })
  
  socket.on("CASHIER_CONNECTED", () => {
  	cashierSocket = socket;
  	cashierSocket.emit("ACK_CONNECTION");
  })
  
  socket.on("TRIGGER_MINIGAME", () => {
  	socket.emit("TRIGGER_MINIGAME");
  })
  
  socket.on("TRIGGER_FAVOURITE", ()=> {
	socket.emit("TRIGGER_FAVOURITE");
  })
  
  socket.on("LOG_IN", (data) => {
  	find_in_keys(socket, data);
  });
  
  socket.on("SIGN_UP", (data) => {
  	add_user(socket, data);
  })

});

server.listen(3000, () => {
  console.log("Server listening...");
});
