import { socket, name } from "../script.js";
import { json, num, deseleccionar_objeto } from "./inventario.js";

// Lista con divs, claves = id del div
export let favorito = {
    favourite_list: {},
    div_id: null,
};

// Valor del id div seleccionado
var div_id;
var favorito_existe = null;

// Listener para la ventana
window.addEventListener("devicemotion", handle_fav_pos);

export function init_fav() {
	Object.keys(favorito["favourite_list"]).forEach((key) => {
		if (favorito["favourite_list"][key]["favorito"]) {
			favorito_existe = key;
		}
	})
}

function handle_fav_pos(ev) {
	if (favorito["div_id"] != null && (favorito_existe == null || favorito_existe == favorito["div_id"])) {
    	div_id = favorito["div_id"];
    	
    	if (favorito["favourite_list"][div_id]["contador"] < 25) {
    		if (Math.abs(ev.rotationRate.gamma) > 350) {
                favorito["favourite_list"][div_id]["contador"] += 1;
            }
        } else {
            favorito["favourite_list"][div_id]["contador"] = 0;
            change_obj_fav();
            deseleccionar_objeto(div_id);	
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
    json[div_id].favorito = !json[div_id].favorito;
    socket.emit("CHANGE_FAV", div_id, name);
}

function trigger_star_appearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "appear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "yellow";
    num["num"] -= 1;
    favorito_existe = div_id;
}

function trigger_star_disappearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "disappear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "transparent";
    num["num"] += 1;
    favorito_existe = null;
}
