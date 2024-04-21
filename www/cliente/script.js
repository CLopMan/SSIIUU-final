// Imports de otros js
import { init_minigame } from "./funcionalidades/minijuego.js";
import {
    check_log_in,
    check_sign_up,
    register_effective,
    register_error,
} from "./funcionalidades/registro.js";
import {
    init_duel,
    get_duel_done,
    display_duel_outcome,
    get_stolen_object,
    display_object_lost,
    show_rules,
    accept_rules,
    gen_duel_qr,
    start_duel_scanning,
    hide_duel_qr,
} from "./funcionalidades/duelo.js";
import {
    leer_estado,
    cargar_estado,
    generar_bloque,
    num,
} from "./funcionalidades/inventario.js";

// Socket
export const socket = io();
var id;
export var name;

// Botones del menú
const qr_duel_button = document.getElementById("qr_duel_button");
const add_button = document.getElementById("add_button");
const scan_duel_button = document.getElementById("scan_duel_button");

// Listeners para los botones
qr_duel_button.addEventListener("touchend", async () => {
    // Muestra las reglas del duelo
    show_rules();
    await accept_rules();

    // Si tiene objetos, muestra el qr
    if (num["num"] > 0) {
        gen_duel_qr(id);
        socket.emit("REGISTER_DUEL");
    }
});
add_button.addEventListener("touchend", () => socket.emit("TRIGGER_ADD"));
scan_duel_button.addEventListener("touchend", async () => {
    // Muestra las reglas del duelo
    show_rules();
    await accept_rules();

    // Si tiene objetos, muestra scanner
    if (num["num"] > 0) {
        start_duel_scanning();
    }
});

// Variables para el duelo
var opponent_id;
var opponent_name;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
            leer_estado();
            name = username;
        }
    });

    socket.on("SIGN_UP_RESPONSE", (res, username) => {
        if (res == -1) {
            register_error("EL usuario ya existe", 1);
        } else if (res == 0) {
            register_effective();
            leer_estado();
            name = username;
        }
    });

    socket.on("TRIGGER_MINIGAME", minigame);

    socket.on("STATE_LOADED", (data) => {
        sleep(500).then(() => {
            cargar_estado(data);
        });
    });

    socket.on("REGISTER_DUEL", (op_id) => {
        opponent_id = op_id;
        hide_duel_qr();
        socket.emit("TRIGGER_DUEL", opponent_id);
    });

    socket.on("TRIGGER_DUEL", (timer, op_name) => {
        opponent_name = op_name;
        duel(timer);
    });

    socket.on("DUEL_WON", async (objects) => {
        display_duel_outcome(objects, 1);
        let object = await get_stolen_object();
        socket.emit("DUEL_OBJECT", object, opponent_id);
        generar_bloque(objects[object]["tipo"]);
    });

    socket.on("DUEL_LOST", (objects) => {
        display_duel_outcome(objects, 0);
        socket.emit("DUEL_OBJECT", null, opponent_id);
    });

    socket.on("OBJECT_LOST", (object) => {
        display_object_lost(object);
        leer_estado();
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
document
    .getElementById("minigame_button")
    .addEventListener("touchend", () => socket.emit("TRIGGER_MINIGAME"));

// Gestión de info
let titulo = document.getElementById("info");
titulo.addEventListener("touchend", () => {
    let div_info = document.getElementById("info-div");
    div_info.style.display = "block";
    let info1 = document.getElementById("info1");
    info1.style.display = "block";
    let info2 = document.getElementById("info2");
    info2.style.display = "none";
    let next_buttom = document.getElementById("info_next_button");
    next_buttom.style.display = "block";

    let close_buttom = document.getElementById("info_close_button");

    close_buttom.addEventListener("touchend", () => {
        div_info.style.display = "none";
    });

    next_buttom.addEventListener("touchend", () => {
        info1.style.display = "none";

        info2.style.display = "block";
        next_buttom.style.display = "none";
        close_buttom.addEventListener("touchend", () => {
            div_info.style.display = "none";
        });
    });
});
