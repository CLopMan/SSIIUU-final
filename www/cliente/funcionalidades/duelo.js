const inventario = document.getElementById("inventario");
const duel_page = document.getElementById("duelo");

const op_inventario = document.getElementById("inventario_oponente");
const h1_op_inv = document.getElementById("h1_op_inv");

const user_banner = document.getElementById("banner_user");
const op_banner = document.getElementById("banner_opponent");

const duel_warning = document.getElementById("duel_warning");
let done = false;
let loss_id;

duel_warning.addEventListener("click", register_done);

export async function write_duel_petition() {
	Nfc.write("Petition: " + socket.id + "," + name)
	.then(() => {
		console.log("Petición de duelo enviada");
	})
	.catch((err) => {
		console.log("Error al escribir en etiqueta NFC:", error);
	});
}

export async function write_hello(writer, reader) {
	const message = new NDEFMessage([
		new NDEFRecord({
			recordType: "text",
			mediaType: "text/plan",
			data: "hello there"
		})
	]);
	
	writer.write(message)
	.then(() => {
		console.log("Mensaje de hola escrito");
		reader.scan()
		.then(() => {
			console.log("Escaneo NFC iniciado");
		})
		.catch(err => {
			console.log(err);
		});
	})
	.catch((err) => {
		console.log("Error al escribir en etiqueta NFC:", error);
	})
}

export function appear_duel_symbol() {
	
}

export function init_duel(timer, name, op_name) {
	inventario.style.display = "none";
	duelo.style.display = "block";
	
	user_banner.innerHTML = name;
	op_banner.innerHTML = op_name;
	
	user_banner.style.backgroundColor = "blue";
	op_banner.style.backgroundColor = "red";
	
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";
	
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		
		user_banner.style.marginLeft = "-80vw";
		op_banner.style.marginLeft = "100vw";
		window.setTimeout(appear_duel_warning, timer);
	}, 2000);
}

function appear_duel_warning() {
	duel_warning.style.display = "block";
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

export function display_duel_outcome(res, objects) {
	if (res == 0) {
		display_win(objects);
	}
	else {
		display_loss();
	}
}

function display_win(objects) {
	// Cambia el estilo del user
	let user = user_banner.innerHTML; 
	user_banner.innerHTML = "Ganador: " + user;
	user_banner.style.backgroundColor = "yellow";
	user_banner.style.color = "black";
	
	// Cambia el estilo del oponente
	let op = op_banner.innerHTML;
	op_banner.innerHTML = "Perdedor: " + op;
	op_banner.style.backgroundColor = "purple";
	op_banner.style.color = "black";
	
	// Aparecen los banners
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";

	// Se ocultan los banners
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		user_banner.style.marginLeft = "-80vw";
		op_banner.style.marginLeft = "100vw";
		window.setTimeout(() => {
			show_inventory(objects, 1);
		})
	}, 2000);
}

function display_loss(objects) {
	// Esconde el warning de duelo
	duel_warning.style.display = "none";
	window.clearTimeout(loss_id);
	
	// Cambia el estilo del user
	let user = user_banner.innerHTML; 
	user_banner.innerHTML = "Perdedor: " + user;
	user_banner.style.backgroundColor = "purple";
	user_banner.style.color = "black";

	// Cambia el estilo del oponente
	let op = op_banner.innerHTML;
	op_banner.innerHTML = "Ganador: " + op;
	op_banner.style.backgroundColor = "yellow";
	op_banner.style.color = "black";
	
	// Aparecen los banners
	user_banner.style.animation = "appear_banner_left 1s 1";
	op_banner.style.animation = "appear_banner_right 1s 1";
	user_banner.style.marginLeft = "0vw";
	op_banner.style.marginLeft = "20vw";
	
	// Se ocultan los banners
	window.setTimeout(() => {
		user_banner.style.animation = "disappear_banner_left 1s 1";
		op_banner.style.animation = "disappear_banner_right 1s 1";
		user_banner.style.marginLeft = "-80vw";
		op_banner.style.marginLeft = "100vw";
		window.setTimeout(() => {
			show_inventory(objects, 0);
		})
	}, 2000);
}

function show_inventory(objects, won) {
	inventario.style.display = "block";
	duel_page.style.display = "none";
	
	op_inventario.style.display = "block";
	if (won == 1) {
		h1_op_inv.inerHTML = "ROBA UN OBJETO";	
	}
	else {
		h1_op_inv.innerHTML = "TUS OBJETOS";
	}
}

export async function get_duel_done() {
	while (done == false) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}
	return true;
}

export function display_object_lost() {

}
