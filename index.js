const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');	
const crypto = require("crypto");

app.use('/', express.static(path.join(__dirname, 'www')));

let cashierSocket;
let registro_duelos = {};
let duelos = {};
let objects_lost = {};
let socket_name = {};
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

function read_objects() {
	fs.readFile("./data_user/items.json", "utf-8", (err, data) => {
		if (err) {
			console.log(err);
		}
		else {
			let items = JSON.parse(data);
			return items;
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

function write_objects(objects) {
	fs.writeFile("./data_user/items.json", JSON.stringify(objects), (err) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log("Items guardados");
		}	
	})
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

function add_object(object, username) {
	let data = read_objects();
	data[username][object] = "añadido";
	write_objects(data);
}

function del_object(object, username) {
	let data = read_objects();
	let data_user = {};
	
	Object.keys(data[username]).forEach((item) => {
		if (item != object) {
			data_user[username][item] = data[username][item];
		}
	});
	
	data[username] = data_user[username];
	write_object(data);
	
}

async function wait_register(id) {
	while (registro_duelos[id] == null) {
		await new Promise(resolve => setTimeout(resolve, 50));
	}
	
	return ;
}

async function wait_duel(opponent_id){
	while (duelos[opponent_id] == null) { 
  		await new Promise(resolve => setTimeout(resolve, 50)); 
  	}

	return ;
}

async function wait_object(id) {
	while (objects_lost[id] == null) {
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	
	return ;
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
  
  socket.on("REGISTER_DUEL", async (op_id) => {
  	if (op_id != null) {
  		registro_duelos[socket.id] = op_id;
  		registro_duelos[op_id] = socket.id;
  	}
  	
  	await wait_register(socket.id);
  	
  	if (registro_duelos[socket.id] != -1) {
  		socket.emit("REGISTER_DUEL", registro_duelos[socket.id]);
  	}
  	else {
  		registro_duelos[socket.id] = null;
  	}
  })
  
  socket.on("UNREGISTER_DUEL", () => {
  	registro_duelos[socket.id] = -1;
  })
  
  socket.on("TRIGGER_DUEL", async (op_id) => {
  	// Triger de duel, recibe id del oponente
  	let timer;
  	
  	if (duelos[op_id] != null) {
  		timer = duelos[op_id]["timer"]; // Escoge el timer del rival
  	}
  	else {
  		timer = Math.random()*3000 + 3000; // Entre 3 y 6 segundos
  	}
  	
  	duelos[socket.id] = {"opponent": op_id, "timer": timer, "done": null};
  	
  	await wait_duel(op_id);
  	socket.emit("TRIGGER_DUEL", timer, socket_name[op_id]);
  })
  
  socket.on("DUEL_FINISHED", async (op_id) => {
  	// Función que registra el ganador del duelo
  	
  	// Registra fin del duelo
  	duelos[socket.id]["done"] = true;
  	
  	// Si el otro no ha registrado el fin, gana
  	if (duelos[op_id]["done"] == null) {
	  	let objects = {"pipas": "5€"}; // read_objects[username];
  		socket.emit("DUEL_WON", objects);
  	}
  	else {
  		duelos[socket.id] = null;
  		duelos[op_id] = null;
  		socket.emit("DUEL_LOST", null);
  	}
  });
  
  socket.on("DUEL_OBJECT", async(object, op_id) => {
  	if (object == null) {
  		await wait_object(socket.id);
  		
  		socket.emit("OBJECT_LOST", objects_lost[socket.id]);
  		//del_object(objects_lost[id], socket_name[id]);
  		duelos[socket.id] = null;
  		objects_lost[socket.id] = null;
  		registro_duelos[socket.id] = null;
  	}
  	
  	objects_lost[op_id] = object;
  	duelos[socket.id] = null;
  	objects_lost[socket.id] = null;
  	registro_duelos[socket.id] = null;
  	//add_object(object, socket_name[id]);
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
