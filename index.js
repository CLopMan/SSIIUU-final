const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');	
const crypto = require("crypto");

app.use('/', express.static(path.join(__dirname, 'www')));

let cashierSocket;
let duelos = {};
let objects_lost = {};
let socket_name = {1: "manu", 2: "cesar"};
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

function read_objects(name) {
	fs.readFile("./data_user/keys.json", "utf-8", (err, data) => {
		if (err) {
			console.log(err);
		}
		else {
			let users = JSON.parse(data);
			return users[name];
		}
	})
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
		socket.emit("LOG_IN_RESPONSE", -1, null);
		return ;
	};
	
	let b64_pwd = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	
	if (user_pwd != b64_pwd) {
		socket.emit("LOG_IN_RESPONSE", -2, null);
		return ;
	};
	
	socket_name[socket.id] = data["user"];
	socket.emit("LOG_IN_RESPONSE", 0, data["user"]);
}

function add_user(socket, data) {
	if (keys[data["user"]] != null) {
		socket.emit("SIGN_UP_RESPONSE", -1, null);
		return ;
	}
	
	// Cambiar esta línea para cambiar el JSON
	keys[data["user"]] = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
	write_keys();
	
	socket_name[socket.id] = data["user"];
	socket.emit("SIGN_UP_RESPONSE", 0, data["user"]);
}

async function wait_duel(opponent_id, timer){
	while (duelos[opponent_id] == null) { 
  		await new Promise(resolve => setTimeout(resolve, 70)); 
  	}
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
  
  socket.on("TRIGGER_DUEL", (opponent_id) => {
  	let timer;
  	
  	if (duelos[opponent_id] != null) {
  		timer = duelos[opponent_id]["timer"];
  	}
  	else {
  		timer = Math.random*1000 + 5000;
  	}
  	
  	duelos[socket.id] = {"opponent": opponent_id, "timer": timer, "time": null};
  	
  	while (duelos[opponent_id] == null) { ; }
  	
  	socket.on("TRIGGER_DUEL", timer);
  })
  
  socket.on("TRIGGER_DUEL_2", async (id, opponent_id) => {
  	let timer;
  	
  	if (duelos[opponent_id] != null) {
  		timer = duelos[opponent_id]["timer"];
  	}
  	else {
  		timer = Math.random() * 1000 + 5000;
  	}
  	
  	duelos[id] = {"opponent": opponent_id, "timer": timer, "time": null};

  	await wait_duel(opponent_id, timer);
	socket.emit("TRIGGER_DUEL", timer, socket_name[opponent_id]); 
  })
  
  socket.on("DUEL_FINISHED", (op_id, op_name, time) => {
  	duelos[socket.id]["time"] = time;
  	while (duelos[op_id]["time"] == null) { ; }
  	if (time < duelos[op_id]["time"]) {
  		let objects = read_objects(op_name);
  		socket.emit("DUEL_WON", objects);
  	}
  	else if (time > duelos[op_id]["time"]) {
  		socket.emit("DUEL_LOST");
  	}
  	else {
  		socket.emit("DUEL_TIED")
  	}
  });
  
  socket.on("DUEL_OBJECT", (object, op_id) => {
  	if (object == null) {
  		while (objects_lost[socket.id] == null) { ; }
  		socket.emit("OBJECT_LOST", objects_lost[socket.id]);
  		del_object(socket_name[socket.id]);
  	}
  	objects_lost[op_id] = object;
  	add_object(socket_name[socket.id]);
  });
  
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
