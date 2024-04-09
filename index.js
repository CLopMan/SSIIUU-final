const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');	
const crypto = require("crypto");

app.use('/', express.static(path.join(__dirname, 'www')));

let clientSocket;
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

function find_in_keys(data) {
	let user_data = keys[data["user"]];
	if (user_data == null) {
		clientSocket.emit("LOG_IN_RESPONSE", -1);
		return ;
	};
	
	let user_pwd = user_data["pwd"];
	let b64_pwd = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	
	if (user_pwd != b64_pwd) {
		clientSocket.emit("LOG_IN_RESPONSE", -2);
		return ;
	};
	
	clientSocket.emit("LOG_IN_RESPONSE", 0);
}

function add_user(data) {
	if (keys[data["user"]] != null) {
		clientSocket.emit("SIGN_UP_RESPONSE", -1);
		return ;
	}
	
	// Cambiar esta línea para cambiar el JSON
	keys[data["user"]] = {"pwd": crypto.createHash("sha256").update(data["pwd"]).digest("base64")};
	write_keys();
	clientSocket.emit("SIGN_UP_RESPONSE", 0);
}

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
  
  socket.on("LOG_IN", (data) => {
  	find_in_keys(data);
  });
  
  socket.on("SIGN_UP", (data) => {
  	add_user(data);
  })

});

server.listen(3000, () => {
  console.log("Server listening...");
});
