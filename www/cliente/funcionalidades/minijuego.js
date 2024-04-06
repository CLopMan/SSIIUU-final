const inventario = document.getElementById("inventario");
const minijuego = document.getElementById("minijuego");
const wave = document.getElementById("wave");
const shadow = document.getElementById("shadow");
const styleSheet = document.styleSheets[0];
const aviso = document.getElementById("aviso");
const reglas = document.getElementById("reglas_pesca");

const boton_reglas = document.getElementById("boton_reglas");


export function init_minigame() {
	inventario.style.display = "none";
	minijuego.style.display = "block";	
	reglas.style.display = "block";
	boton_reglas.addEventListener("click", () => {
		reglas.style.display = "none"
		start_minigame();		
	});
	
}

function start_minigame() {
	window.setTimeout(trigger_fishing_event, Math.random()*5000+3000);
}

function trigger_fishing_event() {
	trigger_animations();
}

function trigger_animations() {	
	aviso.style.animation = "appear_aviso 0.35s 1";
	window.setTimeout(() => {aviso.style.marginLeft = "0";}, 350);
	wave.style.animation = "ripple 3.6s 1";
	styleSheet.insertRule("#wave::after { animation: ripple-2 3.6s 1 }");
	shadow.style.animation = "appear_shadow 1.8s 1";
	
	window.setTimeout(() => {
		shadow.style.animation = "disappear_shadow 1.8s 1";
		aviso.style.animation = "disappear_aviso 0.35s 1";
		window.setTimeout(()=> {aviso.style.marginLeft = "100vw"}, 350);
	}, 1800);
	
	window.setTimeout(() => {
		wave.style.animation = "none";
		styleSheet.insertRule("#wave::after { animation: none}");
		shadow.style.animation = "none";		
	}, 3600)
}
