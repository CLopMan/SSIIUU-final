// Variable para ver si hay un objeto para hacer el favorito
var favorito = false;
var contador = 0;
var obj_fav = false;
const star = document.getElementsByClassName("star")[0];

// Listener para el favorito
window.addEventListener("devicemotion", handle_pos);

export function change_fav() {
	favorito = !favorito;
}

function handle_pos(ev){
	if (favorito) { 
		if (contador < 50) {
			if (Math.abs(ev.rotationRate.beta) > 200) {
				contador += 1;
				console.log(contador);
			}
		}
		else {
			change_obj_fav();
			contador = 0;
			favorito = 0;
		}
	}
}

function change_obj_fav() {
	if (!obj_false) {
		trigger_star_appearing();
	}
	else {
		trigger_star_disappearing();
	}
	obj_fav = !obj_fav;
}

function trigger_star_appearing() {
	
}

function trigger_star_disappearing() {

}
