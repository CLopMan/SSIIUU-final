const inventario = document.getElementById("inventario");
const minijuego = document.getElementById("minijuego");
const wave = document.getElementById("wave");
const shadow = document.getElementById("shadow");
const styleSheet = document.styleSheets[0];
const exclamation = document.getElementById("exclamacion");
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
	exclamation.style.display = "block";
	window.setTimeout(()=> (exclamation.style.display = "none"), 1800);
	trigger_animations();
}

function trigger_animations() {	
	wave.style.animation = "ripple 3.6s 1";
	styleSheet.insertRule("#wave::after { animation: ripple-2 3.6s 1 }");
	shadow.style.animation = "appear_shadow 1.8s 1";
	
	window.setTimeout(() => {
		wave.style.animation = "none";
		styleSheet.insertRule("#wave::after { animation: none}");
		shadow.style.animation = "disappear_shadow 1.8s 1";
		window.setTimeout(() => {shadow.style.animation = "none";}, 1800);		
	}, 1800);
}
