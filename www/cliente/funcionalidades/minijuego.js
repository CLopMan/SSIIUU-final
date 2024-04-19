import { last_predict } from "./annadir.js";
import { generar_bloque } from "./inventario.js";

// Constantes de las escenas
const inventario = document.getElementById("inventario");
const minijuego = document.getElementById("minijuego");
const styleSheet = document.styleSheets[1];

// Constantes para la animación de la onda
const wave = document.getElementById("wave");
const shadow = document.getElementById("shadow");

// Constantes de inicio, final y warning
const reglas = document.getElementById("reglas_pesca");
const boton_reglas = document.getElementById("boton_reglas");
const warning = document.getElementById("aviso");
const boton_cerrar = document.getElementById("cerrar_minijuego");

// Constantes para la animación del pez
const fish = document.getElementById("pez");
const fish_oval = document.getElementById("pez_ovalo");
const fish_triangle = document.getElementById("pez_triangulo");

// Variables para la captura
var tries_id;
var next_try_id;
var capturado = false;
var capturable = false;
var beta;

// Listener para la pesca por movimiento
window.addEventListener("deviceorientation", handle_pos);

export function init_minigame() {
	// Corrige el warning
	warning.style.marginLeft = "100vw";
	warning.style.color = "red";
	warning.innerHTML = "!!!";
	
	// Enseña las reglas
	reglas.style.display = "block";

	// Oculta el botón de cerrar	
	boton_cerrar.style.display = "none";
	
	// Enseña la página
	inventario.style.display = "none";
	minijuego.style.display = "block";
	
	// Reinicia las animaciones
	warning.style.animation = "";
	wave.style.animation = "";
	shadow.style.animation = "";
	fish.style.animation = "";
	fish_oval.style.animation = "";
	fish_triangle.style.animation = "";
	
	// Reinicia el bool
	capturable = false;
	capturado = false;
}

function start_minigame_round(intentos) {
	/* Función que inicia la ronda minijuego*/
	
	// Si todavía puede
	if (intentos > 0) {
		
		// Se resta un intento
		intentos -= 1;
		
		// Se calcula un timer, entre 3 y 8 segundos
		let contador = Math.random()*5000+3000;
		
		// Se pone un timer al aviso de los intentos y al siguiente intento
		let aviso = contador + 4500;
		let siguiente_intento = aviso + 2000;
		
		// LLama al evento de pesca
		window.setTimeout(trigger_fishing_event, contador);
		tries_id = window.setTimeout(show_tries, aviso, intentos);	
		next_try_id = window.setTimeout(start_minigame_round, siguiente_intento, intentos);
	}
	else {
		// Se avisa de que no hay más intentos y se pone el botón de cerrar
		warning.innerHTML = "Intentos acabados";
		warning.style.animation = "appear_aviso 0.35s 1";
		warning.style.marginLeft = "0vw";
		window.setTimeout(() => {
			boton_cerrar.style.display = "block";
		}, 350);
	}
}

function show_tries(intentos) {
	/* Función que enseña los intentos restantes*/
	
	// Reinicia el id del timer
	tries_id = null;
	
	// Enseña los intentos
	warning.innerHTML = "Intentos restantes: " + intentos;
	warning.style.animation = "appear_aviso 0.35s 1";
	warning.style.marginLeft = "0vw";
	
	// Se ocultan los avisos en 1.5 segundos
	window.setTimeout(hide_tries, 1500);
}

function hide_tries() {
	/*Función que oculta los intentos */ 
	warning.style.animation = "disappear_aviso 0.35s 1";
	warning.style.marginLeft = "100vw";
	window.setTimeout(() => {
		warning.innerHTML = "!!!";
	}, 350);
}

function trigger_fishing_event() {
	// Pone el evento capturable a true y luego inicia las animaciones
	capturable = true;
	navigator.vibrate(500);
	trigger_animations();
}

function handle_pos(ev) {
	/*Función que comprueba la orientación del dispositivo*/
	
	// Si se puede capturar
	if (capturable) {
		// Si el jugador ha hecho un movimiento de 70 grados en el eje beta 
		if (Math.abs(ev.beta - beta) >= 70) {
			// Se evita enseñar el número de intentos e iniciar la siguiente ronda
			if (tries_id != null) {
				window.clearTimeout(tries_id);
				window.clearTimeout(next_try_id);
			}
			
			// Se llama a trigger win
			window.setTimeout(trigger_win, 350);
		}
	}
	else {
		// Actualiza la posición del dispositivo en el eje beta
		beta = ev.beta;
	}
}

function trigger_animations() {	
	/*Función que llama a las animaciones cuando sale el pez*/
	
	// Hace aparecer el aviso del pez
	warning.style.animation = "appear_aviso 0.35s 1";
	warning.style.marginLeft = "0";
	
	// Se llama la animación de las ondas y de la aparición de la sombra
	wave.style.animation = "ripple 3.6s 1";
	styleSheet.insertRule("#wave::after { animation: ripple-2 3.6s 1 }");
	shadow.style.animation = "appear_shadow 1.8s 1";
	
	// Se espera a que el pez aparezca para hacerlo desaparecer
	window.setTimeout(() => {
		
		// La sombra y el aviso desaparece
		if (!capturado) {
			shadow.style.animation = "disappear_shadow 1.8s 1";

			// El pez ya no es capturable
			capturable = false;
		}
				
		warning.style.animation = "disappear_aviso 0.35s 1";
		warning.style.marginLeft = "100vw";
		
	}, 1800);
	
	// Se reinician las animaciones de las ondas y la sombra
	window.setTimeout(() => {
		wave.style.animation = "";
		styleSheet.deleteRule(0);
	}, 3600);
}

function trigger_win() {
	/*Función que llama a las animaciones cuando el usuario gana*/
	capturado = true;
	capturable = false;
	
	// Aparece el pez por encima del agua
	fish.style.animation = "appear_pez 0.1s 1";
	fish.style.opacity = "1"; 
	
	window.setTimeout(()=> {
		
		// En 0.5s se reinicia la animación y se llama a la de la pesca del pez
		fish_oval.style.animation = "subir_pez_ovalo 1s 1";
		fish_triangle.style.animation = "subir_pez_triangulo 1s 1";
		
		window.setTimeout(() => {
			
			// Se reinician las animaciones del pez para que no aparezca
			fish.style.opacity = "0";

			window.setTimeout( () => {
				// En 1.5s se enseña el mensaje de ganar
				warning.innerHTML = `¡Enhorabuena! Has conseguido: ${last_predict}`;
				warning.style.color = "green";
				warning.style.animation = "appear_aviso 0.35s 1";
				warning.style.marginLeft = "0";
				
				// Se deja el mensaje en pantalla			
				window.setTimeout(() => {			
					boton_cerrar.style.display = "block";
				}, 350);
			}, 700);
		}, 900);
	}, 150);
}

// Añade el listener al botón de reglas	
boton_reglas.addEventListener("touchend", () => {
	reglas.style.display = "none"
	start_minigame_round(3);		
});

// Añade el listener al botón de cerrar
boton_cerrar.addEventListener("touchend", () => {
	inventario.style.display = "block";
	minijuego.style.display = "none";
	if (capturado == true) {
		generar_bloque(last_predict);
	}
});
	
