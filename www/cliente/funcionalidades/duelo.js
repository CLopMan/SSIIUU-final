const inventario = document.getElementById("inventario");
const duel_page = document.getElementById("duelo");
const op_inventario = document.getElementById("inventario_oponente");

const h1_op_inv = document.getElementById("h1_op_inv");
const conf = document.getElementById("confirmation")
let conf_div;
const wait_msg = document.getElementById("wait_msg");

const user_banner = document.getElementById("banner_user");
const op_banner = document.getElementById("banner_opponent");

const duel_warning = document.getElementById("duel_warning");
const object_lost = document.getElementById("object_lost");

let done = false;
let loss_id;
var stolen_object;
let beta;
let duel_start = false;

duel_warning.addEventListener("click", register_done);
window.addEventListener("deviceorientation", handle_pos);

export async function write_duel_petition() {
	Nfc.write("Petition: " + socket.id + "," + name)
	.then(() => {
		console.log("Petición de duelo enviada");
	})
	.catch((err) => {
		console.log("Error al escribir en etiqueta NFC:", error);
	});
}

export function write_hello(reader) {
	reader.write("Hello there")
	.then(() => {
		console.log("Mensaje de hola escrito");
	})
	.catch((err) => {
		console.log(err);
	})
}

export function appear_duel_symbol() {
	
}

export function init_duel(timer, name, op_name) {
	// Reinicia variables
	done = false;
	stolen_object = null;
	duel_start = false;
	if (conf_div != null) {
		conf_div.style.display = "none";
	}
	
	// Guarda el nombre en el banner
	user_banner.innerHTML = name;
	op_banner.innerHTML = op_name;

	// Reinicia el mensaje de espera y del duelo
	wait_msg.style.animation = "";
	wait_msg.style.marginLeft = "100%";
	object_lost.style.animation = "";
	object_lost.style.marginLeft = "100vw";

	// Aparece el duelo
	inventario.style.display = "none";
	duelo.style.display = "block";
	
	// Animación de aparición del bannner	
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";
	
	// Animación de desaparición del banner
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		
		user_banner.style.marginLeft = "-85vw";
		op_banner.style.marginLeft = "105vw";
		
		// Comienzo del duelo
		window.setTimeout(appear_duel_warning, timer);
	}, 2000);
}

function appear_duel_warning() {
	navigator.vibrate(500);
	duel_warning.style.display = "block";
	duel_start = true;
	loss_id = window.setTimeout(trigger_loss, 10000);	
}

function trigger_loss() {
	duel_warning.style.display = "none";
	done = true;
}

function register_done() {
	done = true;
	duel_warning.style.display = "none";	
	window.clearTimeout(loss_id);
}

export function display_duel_outcome(objects) {
	if (objects != null) {
		display_win(objects);
	}
	else {
		display_loss(objects);
	}
}

function display_win(objects) {
	// Cambia el estilo del user
	let user = user_banner.innerHTML; 
	user_banner.innerHTML = "Ganador: " + user;
	
	// Cambia el estilo del oponente
	let op = op_banner.innerHTML;
	op_banner.innerHTML = "Perdedor: " + op;
	
	// Aparecen los banners
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";

	// Se ocultan los banners
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		user_banner.style.marginLeft = "-85vw";
		op_banner.style.marginLeft = "105vw";
		window.setTimeout(() => {
			duel_aftermath(objects);
		})
	}, 2000);
}

function display_loss() {
	// Esconde el warning de duelo
	duel_warning.style.display = "none";
	window.clearTimeout(loss_id);
	
	// Cambia el estilo del user
	let user = user_banner.innerHTML; 
	user_banner.innerHTML = "Perdedor: " + user;
	
	// Cambia el estilo del oponente
	let op = op_banner.innerHTML;
	op_banner.innerHTML = "Ganador: " + op;
	
	// Aparecen los banners
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";
	
	// Se ocultan los banners
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		user_banner.style.marginLeft = "-85vw";
		op_banner.style.marginLeft = "105vw";
		window.setTimeout(() => {
			duel_aftermath(null);
		})
	}, 2000);
}

function duel_aftermath(objects) {
	
	if (objects != null) {
		h1_op_inv.innerHTML = "ROBA UN OBJETO";	
		op_inventario.style.display = "block";
		inventario.style.display = "block";
		duel_page.style.display = "none";
	}
	else {
		wait_for_object_lost();
		return ;
	}
	
	Object.keys(objects).forEach((item) => {
		let div = document.createElement("div");
		
		// Nombre del objeto
		let p = document.createElement("p")
		p.innerHTML = item;
		p.setAttribute("class", "item_p");
		
		p.addEventListener("click", confirmation);
		
		div.appendChild(p);
		
		// Confirmación del objeto
		let confirmation_div = document.createElement("div")
		confirmation_div.setAttribute("class", "confirmation_div");
		
		// Texto de confirmación
		let p_conf = document.createElement("p");
		p_conf.innerHTML = "¿Estás seguro?";
		confirmation_div.appendChild(p_conf);
		
		// Botones
		let button_yes = document.createElement("button");
		let button_no = document.createElement("button");
		
		button_yes.setAttribute("class", "button_yes");
		button_no.setAttribute("class", "button_no");
		
		button_yes.innerHTML = "SI";
		button_no.innerHTML = "NO";
		
		button_yes.addEventListener("click", confirmation_yes);
		button_no.addEventListener("click", confirmation_no);
		
		confirmation_div.appendChild(button_yes);
		confirmation_div.appendChild(button_no);
		
		// Añadir div
		div.appendChild(confirmation_div);
		div.setAttribute("class", "item_div");
		op_inventario.appendChild(div);
	})
	
}

function wait_for_object_lost() {
	wait_msg.style.animation = "appear_wait_msg 0.5s 1";
	wait_msg.style.marginLeft = "0%";
}

function confirmation(ev) {
	if (conf_div != null) {
		conf_div.style.display = "none";
	}
	conf_div = ev.srcElement.parentNode.children[1];
	conf_div.style.display = "block";
}

function confirmation_yes() {
	stolen_object = conf_div.parentNode.children[0].innerHTML;
	op_inventario.style.display = "none";
}

function confirmation_no() {
	conf_div.style.display = "none";
}

export async function get_stolen_object() {
	while (stolen_object == null) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}
	return stolen_object;
}

export async function get_duel_done() {
	while (done == false) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}
	return true;
}

export function display_object_lost(object) {
	duel_page.style.display = "none";
	inventario.style.display = "block";
	object_lost.innerHTML = "Objeto perdido: " + object;
	object_lost.style.animation = "appear_object_lost 1s 1";
	object_lost.style.marginLeft = "0vw";
	
	window.setTimeout(() => {
		object_lost.style.animation = "disappear_object_lost 1s 1";
		object_lost.style.marginLeft = "100vw";
	}, 2500);
}

function handle_pos(ev) {
	if (duel_start) {
		if (Math.abs(beta - ev.beta) > 70) {
			duel_start = false;
			register_done();
		}
	}
	else {
		beta = ev.beta;
	}
}
