const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fs = require("fs");
const crypto = require("crypto");

app.use("/", express.static(path.join(__dirname, "www")));

let cashierSocket;
let registro_duelos = {};
let duelos = {};
let objects_lost = {};
let socket_name = {};
var keys;

read_keys()
    .then((res) => {
        keys = res;
    })
    .catch((err) => {
        console.log(err);
    });

function read_keys() {
    return new Promise((resolve, reject) => {
        fs.readFile("./data_user/keys.json", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                let res = JSON.parse(data);
                resolve(res);
            }
        });
    });
}

function read_objects() {
    return new Promise((resolve, reject) => {
        fs.readFile("./data_user/items.json", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                let res = JSON.parse(data);
                resolve(res);
            }
        });
    });
}

function write_keys() {
    fs.writeFile("./data_user/keys.json", JSON.stringify(keys), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Usuario añadido");
        }
    });
}

function write_objects(objects) {
    fs.writeFile("./data_user/items.json", JSON.stringify(objects), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Items guardados");
        }
    });
}

function find_in_keys(socket, data) {
    let user_pwd = keys[data["user"]];
    if (user_pwd == null) {
        socket.emit("LOG_IN_RESPONSE", -1, null);
        return;
    }

    let b64_pwd = crypto.createHash("sha256").update(data["pwd"]).digest("base64");

    if (user_pwd != b64_pwd) {
        socket.emit("LOG_IN_RESPONSE", -2, null);
        return;
    }

    socket_name[socket.id] = data["user"];
    socket.emit("LOG_IN_RESPONSE", 0, data["user"]);
}

function add_user(socket, data) {
    if (keys[data["user"]] != null) {
        socket.emit("SIGN_UP_RESPONSE", -1, null);
        return;
    }

    // Registra el usuario con el socket
    socket_name[socket.id] = data["user"];
    socket.emit("SIGN_UP_RESPONSE", 0, data["user"]);

    // Escribe el nuevo usuario
    keys[data["user"]] = crypto.createHash("sha256").update(data["pwd"]).digest("base64");
    write_keys();

    // Reescribe el objeto para guardar los items
    read_objects()
        .then((objects) => {
            objects[data["user"]] = {};
            write_objects(objects);
        })
        .catch((err) => {
            console.log(err);
        });
}

function add_object(object, username) {
    read_objects()
        .then((data) => {
            data[username][object] = "añadido";
            write_objects(data);
        })
        .catch((err) => {
            console.log(err);
        });
}

function del_object(object, username) {
    read_objects()
        .then((data) => {
            let data_user = {};
            data_user[username] = {};
            Object.keys(data[username]).forEach((key) => {
                if (key != object) {
                    data_user[username][key] = data[username][key];
                }
            })
            data[username] = data_user[username];
            write_objects(data);
        })
        .catch((err) => {
            console.log(err);
        });
}

async function wait_register(id) {
    while (registro_duelos[id] == null) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return;
}

async function wait_duel(opponent_id) {
    while (duelos[opponent_id] == null) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return;
}

async function wait_object(id) {
    while (objects_lost[id] == null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return;
}

io.on("connection", (socket) => {
    console.log("socket connected, id: " + socket.id);

    socket.on("CLIENT_CONNECTED", () => {
        socket.emit("ACK_CONNECTION");
    });

    socket.on("CASHIER_CONNECTED", () => {
        cashierSocket = socket;
        cashierSocket.emit("ACK_CONNECTION");
    });

    socket.on("TRIGGER_MINIGAME", () => {
        socket.emit("TRIGGER_MINIGAME");
    });

    socket.on("REGISTER_DUEL", async (op_id) => {
        if (op_id != null) {
            registro_duelos[socket.id] = op_id;
            registro_duelos[op_id] = socket.id;
        }

        await wait_register(socket.id);

        if (registro_duelos[socket.id] != -1) {
            socket.emit("REGISTER_DUEL", registro_duelos[socket.id]);
        } else {
            registro_duelos[socket.id] = null;
        }
    });

    socket.on("UNREGISTER_DUEL", () => {
        registro_duelos[socket.id] = -1;
    });

    socket.on("TRIGGER_DUEL", async (op_id) => {
        // Triger de duel, recibe id del oponente
        let timer;

        if (duelos[op_id] != null) {
            timer = duelos[op_id]["timer"]; // Escoge el timer del rival
        } else {
            timer = Math.random() * 3000 + 3000; // Entre 3 y 6 segundos
        }

        duelos[socket.id] = { opponent: op_id, timer: timer, done: null };

        await wait_duel(op_id);
        socket.emit("TRIGGER_DUEL", timer, socket_name[op_id]);
    });

    socket.on("DUEL_FINISHED", async (op_id) => {
        // Función que registra el ganador del duelo

        // Registra fin del duelo
        duelos[socket.id]["done"] = true;

        // Si el otro no ha registrado el fin, gana
        if (duelos[op_id]["done"] == null) {
            read_objects()
                .then((objects) => {
                	let objects_user = objects[socket_name[op_id]];
                	let objects_to_lose = {}
                	Object.keys(objects_user).forEach((item) => {
                		if (objects_user[item]["fav"] == 0) {
                			objects_to_lose[item] = objects_user[item];
                		}
                	})
                    socket.emit("DUEL_WON", objects_to_lose);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            duelos[socket.id] = null;
            duelos[op_id] = null;
            socket.emit("DUEL_LOST", null);
        }
    });

    socket.on("DUEL_OBJECT", async (object, op_id) => {
        if (object == null) {
            await wait_object(socket.id);

            socket.emit("OBJECT_LOST", objects_lost[socket.id]);
            del_object(objects_lost[socket.id], socket_name[socket.id]);
            duelos[socket.id] = null;
            objects_lost[socket.id] = null;
            registro_duelos[socket.id] = null;
            duelos[op_id] = null;
            objects_lost[op_id] = null;
            registro_duelos[op_id] = null;
        }

        objects_lost[op_id] = object;
        //add_object(object, socket_name[id]);
    });

    socket.on("CHANGE_FAV", (id, name) => {
        read_objects()
            .then((objects) => {
                objects[name][id]["fav"] = !objects[name][id]["fav"];
                write_objects(objects);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on("LOAD_STATE", () => {
        read_objects()
            .then((objects) => {
                socket.emit("STATE_LOADED", objects[socket_name[socket.id]]);
            })
            .catch((err) => {
                console.log(err);
            });
    });
    
    socket.on("STORE_STATE", (json, user) => {
        read_objects()
        .then((objects) => {
        	objects[user] = json;
        	write_objects(objects);
        })
        .catch((err) => {
        	console.log(err);
        })
    });

    socket.on("LOG_IN", (data) => {
        find_in_keys(socket, data);
    });

    socket.on("SIGN_UP", (data) => {
        add_user(socket, data);
    });

    socket.on("PAGO", (name) => {
        console.log('Mensaje "PAGO" recibido desde el cliente');

        // Cargar el archivo JSON que deseas enviar al cliente
        const filePath = path.join(__dirname, "./data_user/items.json");
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("Error al leer el archivo JSON:", err);
                return;
            }

            // Enviar el archivo JSON al cliente
            cashierSocket.emit("jsonData", JSON.parse(data), name);
            console.log(JSON.parse(data));
            console.log("Archivo JSON enviado al cliente");
        });
    });
});

server.listen(3000, () => {
    console.log("Server listening...");
});
