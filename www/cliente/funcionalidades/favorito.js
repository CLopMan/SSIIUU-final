// Variable para ver si hay un objeto para hacer el favorito
var favorito = false;
var contador = 0;
var obj_fav = false;
const star = document.getElementsByClassName("star")[0];
const text_fav = star.children[0];

// Listener para el favorito
window.addEventListener("devicemotion", handle_pos);
star.addEventListener("click", change_obj_fav);
export function change_fav() {
	favorito = !favorito;
}

function handle_pos(ev){
	if (favorito) { 
		if (contador < 50) {
			if (Math.abs(ev.rotationRate.alpha) > 200) {
				contador += 1;
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
	if (!obj_fav) {
		trigger_star_appearing();
	}
	else {
		trigger_star_disappearing();
	}
	obj_fav = !obj_fav;
}

function trigger_star_appearing() {
	star.style.animation = "appear_star 1s 1";
	window.setTimeout(() =>{
		star.style.backgroundColor = "yellow";
		text_fav.innerHTML = "Favorito";
	}, 990);
}

function trigger_star_disappearing() {
	star.style.animation = "disappear_star 1s 1";
	window.setTimeout(() => {
		star.style.backgroundColor = "transparent";
		text_fav.innerHTML = "No favorito";
		
	}, 990);
}
