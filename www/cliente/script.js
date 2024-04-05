function add() {
	console.log("add");
}

function del() {
	console.log("del");
}

function fav() {
	console.log("fav");
}

function inventory() {
	console.log("inventory");
}

function pay() {
	console.log("pay");
}

function minigame() {
	console.log("minigame");
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
  
  socket.on("SENSOR_READING", (data) => {
    const cursor = document.querySelector(`#${data.pointerId}`);
    if (cursor) {
      cursor.style.left = data.coords[0] + window.innerWidth / 2;
      cursor.style.top = data.coords[1] + window.innerHeight / 2;
    }

  });

});


document.getElementById("add_button").addEventListener("touch", () => (socket.emit("TRIGGER_ADD")));

