import { socket } from "../script.js";

// Páginas que cambiar
const inventario = document.getElementById("inventario");
const duel_page = document.getElementById("duelo");

// Generación de QR del duelo
const qr_duel_div = document.getElementById("qr_duel_div");
const qr_duel_images = document.getElementById("qr_duel");
const qr_duel_close_button = document.getElementById("qr_duel_close_button");

// Lectura de QR del duelo
const qr_duel_scanner_div = document.getElementById("duel_scanner_div");
const config = {fps: 10, qrbox: { width: 600, height: 600 }, rememberLastUsedCamera: false, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]};
const qr_duel_scanner = new Html5Qrcode(
    "duel_reader", { formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ] });
const qr_close_duel_scanner = document.getElementById("close_duel_scanner");

// Info del oponente
const op_inventario = document.getElementById("inventario_oponente");
const h1_op_inv = document.getElementById("h1_op_inv");

// Elementos de robo
const conf = document.getElementById("confirmation")
const wait_msg = document.getElementById("wait_msg");
const object_lost = document.getElementById("object_lost");
let conf_div;

// Banners del inicio
const user_banner = document.getElementById("banner_user");
const op_banner = document.getElementById("banner_opponent");

// Warning del duelo 
const duel_warning = document.getElementById("duel_warning");

// Variables del duelo
let done = false;
let loss_id;
var stolen_object;
let beta;
let duel_start = false;

// Listeners de botones
duel_warning.addEventListener("touchend", register_done);
qr_duel_close_button.addEventListener("touchend", () => {
	qr_duel_div.style.display = "none";
	qr_duel_images.removeChild(qr_duel_images.children[0]);
	qr_duel_images.removeChild(qr_duel_images.children[0]);
	socket.emit("UNREGISTER_DUEL");
});
qr_close_duel_scanner.addEventListener("touchend", () => {
	qr_duel_scanner_div.style.display = "none";
	qr_duel_scanner.stop();
})

// Posición
window.addEventListener("deviceorientation", handle_pos);

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

export function display_duel_outcome(objects, win) {
	if (win == 1) {
		display_win(objects, win);
	}
	else {
		display_loss(objects, win);
	}
}

function display_win(objects, win) {
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
			duel_aftermath(objects, win);
		})
	}, 2000);
}

function display_loss(object, win) {
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
			duel_aftermath(object, win);
		})
	}, 2000);
}

function duel_aftermath(objects, win) {
	
	if (win == 1) {
		h1_op_inv.innerHTML = "ROBA UN OBJETO";	
		op_inventario.style.display = "block";
		inventario.style.display = "block";
		duel_page.style.display = "none";

		for (let i of op_inventario.children) {
			if (i.getAttribute("class") == "item_div") {
				i.remove();
			}
			
		}
	}
	else {
		wait_for_object_lost();
		return ;
	}
	
	Object.keys(objects).forEach((item) => {
		let div = document.createElement("div");
		
		// Nombre del objeto
		let p = document.createElement("p")
		p.innerHTML = objects[item]["tipo"];
		p.setAttribute("class", "item_p");
		
		p.addEventListener("touchend", confirmation);
		
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
		
		button_yes.addEventListener("touchend", confirmation_yes);
		button_no.addEventListener("touchend", confirmation_no);
		
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

export function gen_duel_qr(id) {	
	if (qr_duel_images.children.length > 0) {
		qr_duel_images.removeChild(qr_duel_images.children[0]);
		qr_duel_images.removeChild(qr_duel_images.children[0]);
	}
	
	const duel_qr = new QRCode("qr_duel", {
		text: id,
		width: 512,
		height: 512,
		colorDark: "#000000",
		colorLight: "#FFFFFF",
		correctLevel: QRCode.CorrectLevel.H
	});
	
	window.setTimeout(() => {
		qr_duel_div.style.display = "grid";
	}, 100);
}

export function hide_duel_qr() {
	qr_duel_div.style.display = "none";
}

export function start_duel_scanning() {
	qr_duel_scanner_div.style.display = "block";
	qr_duel_scanner.start({facingMode : {exact: "environment"}}, config, scan_duel_success, scan_duel_error);
}

function scan_duel_success(qrCodeMssg) {
	console.log(qrCodeMssg);
	qr_duel_scanner_div.style.display = "";
	qr_duel_scanner.stop();
	socket.emit("REGISTER_DUEL", qrCodeMssg);
	
	
}

function scan_duel_error(err) {

}
