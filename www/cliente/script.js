import {init_minigame} from './funcionalidades/minijuego.js';
import {change_fav} from './funcionalidades/favorito.js';

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
  socket.emit("CLIENT_CONNECTED", { id: 1 });

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK");
  });
  
  socket.on("TRIGGER_ADD", add)
  
  socket.on("TRIGGER_DELETE", del)
  
  socket.on("TRIGGER_FAVOURITE", fav)
  
  socket.on("TRIGGER_INVENTORY", inventory)
  
  socket.on("TRIGGER_PAYMENT", pay)
  
  socket.on("TRIGGER_MINIGAME", minigame)
  
  socket.on("TRIGGER_DUEL", duel)

});

document.getElementById("add_button").addEventListener("touchend", () => {console.log("hola"); location.href='annadir.html'});
document.getElementById("favorito").addEventListener("click", () => (socket.emit("TRIGGER_FAVOURITE")));
document.getElementById("minigame_button").addEventListener("click", () => (socket.emit("TRIGGER_MINIGAME")));