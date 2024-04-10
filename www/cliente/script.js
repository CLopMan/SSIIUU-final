import {init_minigame} from './funcionalidades/minijuego.js';
import {change_fav} from './funcionalidades/favorito.js';
import {check_log_in, check_sign_up, register_effective, register_error} from './funcionalidades/registro.js';
import {appear_duel_symbol, init_duel, get_duel_time, display_duel_outcome, display_object_lost} from './funcionalidades/duelo.js'; 

var opponent_id;
var opponent_name;
var name;

if ('NDEFReader' in window) {
	navigator.permissions.query({name: "nfc"})
	.then(permission_status => {
		if (permission_status.state == "granted") {
			const reader = new NDEFReader();
			const writer = new NDEFWriter();
		
			write_hello(writer, reader);
			
			reader.on("read", (tag) => {
				const message = NdefParser.parse(tag);
				if (message == "hello") {
					appear_duel_symbol();
				}
				else {
					let pos = message.indexOf(":");
					let substr = message.substring(0, pos);
					
					if (substr == "Petition") { 
						appear_duel_petition();
					}
					
					if (substr == "Accepted") {
						let pos_id = message.indexOf(",");
						opponent_id = message.substring(pos+1, pos_id);
						opponent_name = message.substring(pos_id+1);
						socket.emit("TRIGGER_DUEL", opponent_id);
					}
				}
			});
		}
	})
	.catch( () => {"NDEFReader not in browser";})
}

function add() {
	console.log("add");
}

function del() {
	console.log("del");
}

function fav() {
	console.log("Doing client fav");
	change_fav();
}

function inventory() {
	console.log("inventory");
}

function pay() {
	console.log("pay");
}

function minigame() {
	console.log("Doing client minigame");
	init_minigame();
}

async function duel(timer) {
	init_duel(timer, name, opponent_name);
	let time = await get_duel_time();
	socket.emit("DUEL_FINISHED", opponent_id, opponent_name, time);
}

const socket = io();

socket.on("connect", () => {
  socket.emit("CLIENT_CONNECTED");

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK cliente recibido");
  });
  
  socket.on("LOG_IN_RESPONSE", (res, username) => {
  	if (res == -1) {
  		register_error("El usuario no existe", 0);
  	}
  	else if (res == -2) {
  		register_error("Contraseña incorrecta", 0);
  	}
  	else if (res == 0) {
  		register_effective();
  		name = username;
  	}
  })
  
  socket.on("SIGN_UP_RESPONSE", (res, username) => {
  	if (res == -1) {
  		register_error("EL usuario ya existe", 1);
  	}
  	else if (res == 0) {
  		register_effective();
  		name = username;
  	}
  })
  
  socket.on("TRIGGER_ADD", add)
  
  socket.on("TRIGGER_DELETE", del)
  
  socket.on("TRIGGER_FAVOURITE", fav)
  
  socket.on("TRIGGER_INVENTORY", inventory)
  
  socket.on("TRIGGER_PAYMENT", pay)
  
  socket.on("TRIGGER_MINIGAME", minigame)
  
  socket.on("TRIGGER_DUEL", (timer, op_name) => {
  	opponent_name = op_name;
  	duel(timer);
  })
  
  socket.on("DUEL_WON", (objects) => {
  	display_duel_outcome(0, objects);
  	let object = get_stolen_object();
  	socket.emit("DUEL_OBJECT", object, opponent_id);
  })
  
  socket.on("DUEL_LOST", () => {
  	display_duel_outcome(1, null);
  	socket.emit("DUEL_OBJECT", null, null);
  })
  
  socket.on("OBJECT_LOST", (object) => {
  	display_object_lost(object);
  })
  
  socket.on("DUEL_TIED", () => {
  	display_duel_outcome(2, null);
  })

});


document.getElementById("add_button").addEventListener("touch", () => (socket.emit("TRIGGER_ADD")));
document.getElementById("favorito").addEventListener("click", () => (socket.emit("TRIGGER_FAVOURITE")));
document.getElementById("minigame_button").addEventListener("click", () => (socket.emit("TRIGGER_MINIGAME")));
document.getElementById("log-in_register").addEventListener("click", (ev) => {
	let data = check_log_in(ev);
	if (data != null) {
		socket.emit("LOG_IN", data);
	}
});

document.getElementById("sign-up_register").addEventListener("click", (ev) => {
	let data = check_sign_up(ev);
	if (data != null) {
		socket.emit("SIGN_UP", data);
	}
});

document.getElementById("duel_1").addEventListener("click", (ev) => {
	console.log("duel_1");
	socket.emit("TRIGGER_DUEL_2", 1, 2);
})

document.getElementById("duel_2").addEventListener("click", (ev) => {
	console.log("duel_2");
	socket.emit("TRIGGER_DUEL_2", 2, 1);
})
