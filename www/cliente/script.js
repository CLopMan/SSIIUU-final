// Imports de otros js
import { init_minigame } from "./funcionalidades/minijuego.js";
import { change_fav } from "./funcionalidades/favorito.js";
import { check_log_in, check_sign_up, register_effective, register_error } from "./funcionalidades/registro.js";
import { init_duel, get_duel_done, display_duel_outcome, get_stolen_object, display_object_lost, gen_duel_qr, scan_duel_qr} from "./funcionalidades/duelo.js";

// Socket
const socket = io();
var id;
var name;

// Botones del menú
const qr_duel_button = document.getElementById("qr_duel_button"); 
const add_button = document.getElementById("add_button");
const scan_duel_button = document.getElementById("scan_duel_button");

// Listeners para los botones
qr_duel_button.addEventListener("touchend", () => {
	gen_duel_qr(id, name); 
});

add_button.addEventListener("touchend", () => socket.emit("TRIGGER_ADD"));
scan_duel_button.addEventListener("touchend", scan_duel_qr);


// Variables para el duelo
var opponent_id;
var opponent_name;

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
    let done = await get_duel_done();
    socket.emit("DUEL_FINISHED", opponent_id, id);
}

socket.on("connect", () => {
    socket.emit("CLIENT_CONNECTED");
	id = socket.id;
	
    socket.on("ACK_CONNECTION", () => {
        console.log("Cliente conectado");
    });

    socket.on("LOG_IN_RESPONSE", (res, username) => {
        if (res == -1) {
            register_error("El usuario no existe", 0);
        } else if (res == -2) {
            register_error("Contraseña incorrecta", 0);
        } else if (res == 0) {
            register_effective();
            name = username;
        }
    });

    socket.on("SIGN_UP_RESPONSE", (res, username) => {
        if (res == -1) {
            register_error("EL usuario ya existe", 1);
        } else if (res == 0) {
            register_effective();
            name = username;
        }
    });

    socket.on("TRIGGER_ADD", add);

    socket.on("TRIGGER_DELETE", del);

    socket.on("TRIGGER_FAVOURITE", fav);

    socket.on("TRIGGER_INVENTORY", inventory);

    socket.on("TRIGGER_PAYMENT", pay);

    socket.on("TRIGGER_MINIGAME", minigame);

    socket.on("TRIGGER_DUEL", (timer, op_name) => {
        opponent_name = op_name;
        duel(timer);
    });

    socket.on("TIME_NOT_NULL", () => {
        socket.emit("CHECK_TIME", id, opponent_id);
    });

    socket.on("DUEL_WON", async (objects) => {
        display_duel_outcome(objects);
        let object = await get_stolen_object();
        socket.emit("DUEL_OBJECT", object, opponent_id, id);
    });

    socket.on("DUEL_LOST", (objects) => {
        display_duel_outcome(objects);
        socket.emit("DUEL_OBJECT", null, opponent_id, id);
    });

    socket.on("OBJECT_LOST", (object) => {
        display_object_lost(object);
    });
});


document.getElementById("log-in_register").addEventListener("touchend", (ev) => {
    let data = check_log_in(ev);
    if (data != null) {
        socket.emit("LOG_IN", data);
    }
});

document.getElementById("sign-up_register").addEventListener("touchend", (ev) => {
    let data = check_sign_up(ev);
    if (data != null) {
        socket.emit("SIGN_UP", data);
    }
});


// Elementos que sirven para triggerear los eventos, eliminar cuando se puedan lanzar por el flujo esperado de la aplicación
document.getElementById("favorito").addEventListener("touchend", () => socket.emit("TRIGGER_FAVOURITE"));
document.getElementById("minigame_button").addEventListener("touchend", () => socket.emit("TRIGGER_MINIGAME"));
document.getElementById("duel_1").addEventListener("touchend", (ev) => {
    id = 1;
    opponent_id = 2;
    socket.emit("TRIGGER_DUEL", 2, 1);
});

document.getElementById("duel_2").addEventListener("touchend", (ev) => {
    id = 2;
    opponent_id = 1;
    socket.emit("TRIGGER_DUEL", 1, 2);
});
