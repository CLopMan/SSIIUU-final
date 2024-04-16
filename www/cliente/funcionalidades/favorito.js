import { socket, name } from "../script.js";

// Lista con divs, claves = id del div
export var favourite_list = {
    clave_del_div: {
        favorito: 0,
        contador: 0,
        estrella: "literalmente el objeto",
    },
};
export let favorito = {
    favourite_list: {},
    div_id: null,
};

// Valor del id div seleccionado
var div_id;

// Listener para la ventana
window.addEventListener("devicemotion", handle_fav_pos);

function handle_fav_pos(ev) {
	if (favorito["div_id"] != null) {
    	div_id = favorito["div_id"];
    	
    	if (favorito["favourite_list"][div_id]["contador"] < 50) {
            if (Math.abs(ev.rotationRate.alpha) > 200) {
                favorito["favourite_list"][div_id]["contador"] += 1;
            }
        } else {
            favorito["favourite_list"][div_id]["contador"] = 0;
            change_obj_fav();
           	// METER LLAMADA A FUNCIÓN QUE DESELECCIONE EL OBJETO SELECCIONADO	
           	div_id = null;
        }
    }
}

function change_obj_fav() {
    if (!favorito["favourite_list"][div_id]["favorito"]) {
        trigger_star_appearing(div_id);
    } else {
        trigger_star_disappearing(div_id);
    }
    favorito["favourite_list"][div_id]["favorito"] = !favorito["favourite_list"][div_id]["favorito"];
    socket.emit("CHANGE_FAV", div_id, name);
}

function trigger_star_appearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "appear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "yellow";
}

function trigger_star_disappearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "disappear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "transparent";
}
