const inventario = document.getElementById("inventario");
const duel_page = document.getElementById("duelo");

const user_banner = document.getElementById("banner_user");
const op_banner = document.getElementById("banner_opponent");


let time = null;



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
	}, 2000);
	
}

export function display_duel_outcome() {

}

export async function get_duel_time() {
	while (time == null) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}
	return time;
}

export function display_object_lost() {
	
}
