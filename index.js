const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');	
const crypto = require("crypto");

app.use('/', express.static(path.join(__dirname, 'www')));

let clientSocket = {};
let cashierSocket;
var keys;
let id_counter = 0;

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

function find_in_keys(id, data) {
	let user_pwd = keys[data["user"]];
	if (user_pwd == null) {
		clientSocket[id].emit("LOG_IN_RESPONSE", -1);
		return ;
	};
	
	let b64_pwd = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	
	if (user_pwd != b64_pwd) {
		clientSocket[id].emit("LOG_IN_RESPONSE", -2);
		return ;
	};
	
	clientSocket[id].emit("LOG_IN_RESPONSE", 0);
}

function add_user(id, data) {
	if (keys[data["user"]] != null) {
		clientSocket[id].emit("SIGN_UP_RESPONSE", -1);
		return ;
	}
	
	// Cambiar esta línea para cambiar el JSON
	keys[data["user"]] = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	write_keys();
	clientSocket[id].emit("SIGN_UP_RESPONSE", 0);
}

io.on('connection', (socket) => {
	console.log("socket connected");

  socket.on("CLIENT_CONNECTED", () => {
	console.log("client with id " + id_counter + " connected");
    clientSocket[id_counter] = socket;
    clientSocket[id_counter].emit("ACK_CONNECTION", id_counter);
    id_counter += 1;
  })
  
  socket.on("CASHIER_CONNECTED", () => {
  	cashierSocket = socket;
  	cashierSocket.emit("ACK_CONNECTION");
  })
  
  socket.on("TRIGGER_MINIGAME", (id) => {
  	clientSocket[id].emit("TRIGGER_MINIGAME");
  })
  
  socket.on("TRIGGER_FAVOURITE", (id)=> {
  	clientSocket[id].emit("TRIGGER_FAVOURITE");
  })
  
  socket.on("LOG_IN", (id, data) => {
  	find_in_keys(id, data);
  });
  
  socket.on("SIGN_UP", (id, data) => {
  	add_user(id, data);
  })

});

server.listen(3000, () => {
  console.log("Server listening...");
});
