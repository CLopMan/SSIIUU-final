// Lista con divs, claves = id del div
export var favourite_list = {"clave_del_div":
	{
		"favorito": 0,
		"contador": 0,
		"estrella": "literalmente el objeto"
	}
}

// Valor del id div seleccionado
export var div_id;

// Listener para la ventana
window.addEventListener("devicemotion", handle_fav_pos);

function handle_fav_pos(ev){
	if (div_id != null) { 
		if (favourite_list[div_id]["contador"] < 50) {
			if (Math.abs(ev.rotationRate.alpha) > 200) {
				favourite_list[div_id]["contador"] += 1;
			}
		}
		else {
			change_obj_fav(div_id);
			div_id = null;
			favourite_list[div_id]["contador"] = 0;
		}
	}
}

function change_obj_fav() {
	if (!favourite_list[div_id]["favorito"]) {
		trigger_star_appearing(div_id);
	}
	else {
		trigger_star_disappearing(div_id);
	}
	favourite_list[div_id]["favorito"] = !favourite_list[div_id]["favorito"];
}

function trigger_star_appearing() {
	favourite_list[div_id]["estrella"].style.animation = "appear_star 1s 1";
	favourite_list[div_id]["estrella"].style.backgroundColor = "yellow";
}

function trigger_star_disappearing() {
	favourite_list[div_id]["estrella"].style.animation = "disappear_star 1s 1";
	favourite_list[div_id]["estrella"].style.backgroundColor = "transparent";
}
