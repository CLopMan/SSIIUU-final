import {init_minigame} from './funcionalidades/minijuego.js';
import {change_fav} from './funcionalidades/favorito.js';
import {check_log_in, check_sign_up, register_effective, register_error} from './funcionalidades/registro.js';

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

function duel() {
	console.log("duel");
}

const socket = io();

socket.on("connect", () => {
  socket.emit("CLIENT_CONNECTED");

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK cliente recibido");
  });
  
  socket.on("LOG_IN_RESPONSE", (res) => {
  	if (res == -1) {
  		register_error("El usuario no existe", 0);
  	}
  	else if (res == -2) {
  		register_error("Contraseña incorrecta", 0);
  	}
  	else if (res == 0) {
  		register_effective();
  	}
  })
  
  socket.on("SIGN_UP_RESPONSE", (res) => {
  	if (res == -1) {
  		register_error("EL usuario ya existe", 1);
  	}
  	else if (res == 0) {
  		register_effective();
  	}
  })
  
  socket.on("TRIGGER_ADD", add)
  
  socket.on("TRIGGER_DELETE", del)
  
  socket.on("TRIGGER_FAVOURITE", fav)
  
  socket.on("TRIGGER_INVENTORY", inventory)
  
  socket.on("TRIGGER_PAYMENT", pay)
  
  socket.on("TRIGGER_MINIGAME", minigame)
  
  socket.on("TRIGGER_DUEL", duel)

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
