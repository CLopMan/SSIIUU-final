const inventario = document.getElementById("inventario");
const minijuego = document.getElementById("minijuego");
const wave = document.getElementById("wave");
const shadow = document.getElementById("shadow");
const styleSheet = document.styleSheets[0];
const warning = document.getElementById("aviso");
const reglas = document.getElementById("reglas_pesca");
const boton_reglas = document.getElementById("boton_reglas");
const boton_cerrar = document.getElementById("cerrar_minijuego");

export function init_minigame() {
	inventario.style.display = "none";
	minijuego.style.display = "block";	
	reglas.style.display = "block";
	boton_cerrar.style.display = "none";
	warning.innerHTML = "!!!";
	warning.marginLeft = "100vw";
	
	boton_reglas.addEventListener("click", () => {
		reglas.style.display = "none"
		start_minigame(3);		
	});
	boton_cerrar.addEventListener("click", () => {
		inventario.style.display = "block";
		minijuego.style.display = "none";
	});
	
}

function start_minigame(intentos) {
	if (intentos > 0) {
		let contador = Math.random()*5000+3000;
		let aviso = contador + 4500;
		let siguiente_intento = aviso + 2000;
		window.setTimeout(trigger_fishing_event, contador);
		intentos -= 1;
		window.setTimeout(show_tries, aviso, intentos);	
		window.setTimeout(start_minigame, siguiente_intento, intentos);
	}
	else {
		warning.innerHTML = "Intentos acabados";
		warning.style.animation = "appear_aviso 0.35s 1";
		window.setTimeout(() => { 
			warning.style.marginLeft = "0vw";
			boton_cerrar.style.display = "block";
		})
	}
}

function show_tries(intentos) {
	warning.innerHTML = "Intentos restantes: " + intentos;
	warning.style.animation = "appear_aviso 0.35s 1";
	window.setTimeout(() => {warning.style.marginLeft = "0vw"}, 350);
	window.setTimeout(hide_tries, 1000);
}

function hide_tries() {
	console.log(1);
	warning.style.animation = "disappear_aviso 0.35s 1";
	window.setTimeout(() => {
		warning.style.marginLeft = "100vw";
		warning.innerHTML = "!!!";
	}, 350);
}

function trigger_fishing_event() {
	trigger_animations();
}

function trigger_animations() {	
	warning.style.animation = "appear_aviso 0.35s 1";
	window.setTimeout(() => {warning.style.marginLeft = "0";}, 350);
	wave.style.animation = "ripple 3.6s 1";
	styleSheet.insertRule("#wave::after { animation: ripple-2 3.6s 1 }");
	shadow.style.animation = "appear_shadow 1.8s 1";
	
	window.setTimeout(() => {
		shadow.style.animation = "disappear_shadow 1.8s 1";
		warning.style.animation = "disappear_aviso 0.35s 1";
		window.setTimeout(()=> {warning.style.marginLeft = "100vw"}, 350);
	}, 1800);
	
	window.setTimeout(() => {
		wave.style.animation = "none";
		styleSheet.insertRule("#wave::after { animation: none}");
		shadow.style.animation = "none";		
	}, 3600)
}

