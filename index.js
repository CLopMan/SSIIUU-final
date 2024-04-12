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
  
  socket.on("TRIGGER_DUEL", async (op_id, id) => {
  	// Triger de duel, recibe id del oponente. id es opcional, puesto ahí para usar botones
  	if (id == null) {
  		let id = socket.id;
  	}
  	
  	let timer;
  	
  	if (duelos[op_id] != null) {
  		timer = duelos[op_id]["timer"]; // Escoge el timer del rival
  	}
  	else {
  		timer = Math.random()*3000 + 3000; // Entre 3 y 6 segundos
  	}
  	
  	duelos[id] = {"opponent": op_id, "timer": timer, "done": null};
  	
  	await wait_duel(op_id);
  	socket.emit("TRIGGER_DUEL", timer, socket_name[op_id]);
  })
  
  socket.on("DUEL_FINISHED", async (op_id, id) => {
  	// Función que registra el ganador del duelo
  	if (id == null) {
  		let id = socket.id;
  	}
  	
  	// Registra fin del duelo
  	duelos[id]["done"] = true;
  	
  	// Si el otro no ha registrado el fin, gana
  	if (duelos[op_id]["done"] == null) {
	  	let objects = {"pipas": "1€", "jamón": "5€", "pimientos": "2€", "fanta": "1€", "chorizo": "2.5€", "patatas": ".8€", "sandía": "5€", "solomillo": "20€", "ramón bilbao": "4.7€", "pescaito": "1.9€", "chicles": "2€", "iphone": "1200€", "portátil": "1500€", "silla": "50€"}; // read_objects[username];
  		socket.emit("DUEL_WON", objects);
  	}
  	else {
  		duelos[id] = null;
  		duelos[op_id] = null;
  		socket.emit("DUEL_LOST", null);
  	}
  });
  
  socket.on("DUEL_OBJECT", async(object, op_id, id) => {
  	if (id == null) {
  		id = socket.id;
  	}
  	
  	if (object == null) {
  		await wait_object(id);
  		
  		socket.emit("OBJECT_LOST", objects_lost[id]);
  		//del_object(objects_lost[id], socket_name[id]);
  		duelos[id] = null;
  		objects_lost[id] = null;
  	}
  	
  	objects_lost[op_id] = object;
  	duelos[id] = null;
  	objects_lost[id] = null;
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
  socket.on('PAGO', () => {
    console.log('Mensaje "PAGO" recibido desde el cliente');

    // Cargar el archivo JSON que deseas enviar al cliente
    const filePath = path.join(__dirname, "./data_user/items.json");
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }

        // Enviar el archivo JSON al cliente
        cashierSocket.emit('jsonData', JSON.parse(data));
        console.log(JSON.parse(data))
        console.log('Archivo JSON enviado al cliente');
    });
  });

});

server.listen(3000, () => {
  console.log("Server listening...");
});
