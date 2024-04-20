import { socket, name } from "../script.js";
import { json, num, deseleccionar_objeto } from "./inventario.js";

// Lista con divs, claves = id del div
export let favorito = {
    favourite_list: {},
    div_id: null,
};

// Valor del id div seleccionado, necesario para hacer que haya solo 1 favorito
var div_id;
var favorito_existe = null;

// Listener para la ventana
window.addEventListener("devicemotion", handle_fav_pos);

// Función que checkea si hay un favorito, si lo hay, lo guarda
export function init_fav() {
	Object.keys(favorito["favourite_list"]).forEach((key) => {
		if (favorito["favourite_list"][key]["favorito"]) {
			favorito_existe = key;
		}
	})
}

// Función que checkea el movimiento para el favorito
function handle_fav_pos(ev) {
	
	// Si hay un div seleccionado y ese div ya tiene favorito o si hay un div seleccionado y no hay favoritos todavía
	if (favorito["div_id"] != null && (favorito_existe == null || favorito_existe == favorito["div_id"])) {
    	div_id = favorito["div_id"];
    	
    	// Si no se ha llegado todavía al contador
    	if (favorito["favourite_list"][div_id]["contador"] < 20) {
    		
    		// Si se registra movimiento en el eje gamam se aumenta el contador
    		if (Math.abs(ev.rotationRate.gamma) > 350) {
                favorito["favourite_list"][div_id]["contador"] += 1;
            }
        } else {
        
        	// Se reinicia el contador y se cambia el estado del favorito
            favorito["favourite_list"][div_id]["contador"] = 0;
            change_obj_fav();
            
            // Se reinician los objetos seleccionados
            deseleccionar_objeto(div_id);	
           	div_id = null;
        }
    }
}

// Función que cambia el estado del favorito
function change_obj_fav() {

	// Pone la animación correcta
    if (!favorito["favourite_list"][div_id]["favorito"]) {
        trigger_star_appearing(div_id);
    } else {
        trigger_star_disappearing(div_id);
    }
    
    // Se cambia el valor del favorito
    favorito["favourite_list"][div_id]["favorito"] = !favorito["favourite_list"][div_id]["favorito"];
    json[div_id].favorito = !json[div_id].favorito;
    socket.emit("CHANGE_FAV", div_id, name);
}

// Función que pone la animación de favorito = true
function trigger_star_appearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "appear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "yellow";
    favorito_existe = div_id;
    
    // Se quita el número de elemento, ya que el favorito no se puede perder en el duelo
    num["num"] -= 1;
}

// Función que pone la animación de favorito = false
function trigger_star_disappearing() {
    favorito["favourite_list"][div_id]["estrella"].style.animation = "disappear_star 1s 1";
    favorito["favourite_list"][div_id]["estrella"].style.backgroundColor = "transparent";
    favorito_existe = null;
    
    // Se añade un elemento, ya que el objeto podrá ser robado en el duelo
    num["num"] += 1;
}
