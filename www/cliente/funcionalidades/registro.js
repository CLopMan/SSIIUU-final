// Divs de registro
const register = document.getElementById("register");
const log_in = document.getElementById("log-in");
const sign_up = document.getElementById("sign-up");
const error_texts = document.getElementsByClassName("register_error");

// Botones de registro
const log_out_button = document.getElementById("log-out");
const to_sign_up_button = document.getElementById("to_sign-up"); 
const to_log_in_button = document.getElementById("to_log-in");

// Inputs de registro
const login_user = document.getElementById("log-in_username");
const login_pwd = document.getElementById("log-in_pwd");

const signup_user = document.getElementById("sign-up_username");
const signup_pwd = document.getElementById("sign-up_pwd");
const signup_pwd_rep = document.getElementById("sign-up_pwd_rep");

// Bools para el cambio de página
var changeable = false;
var page = 0; // 0 = log-in, 1 = sign-up

var error_id;

// Listeneres de los botones
log_out_button.addEventListener("click", log_out);
to_sign_up_button.addEventListener("click", log_in_to_sign_up);
to_log_in_button.addEventListener("click", sign_up_to_log_in);

// Listener para control por movimientos
window.addEventListener("deviceorientation", handle_pos);

export function check_log_in(ev) {
	ev.preventDefault();
	if (login_user.value.length == 0) {
		register_error("Usuario necesario", page);
		return null;
	}
	
	if (login_pwd.value.length == 0) {
		register_error("Contraseña necesaria", page);
		return null;
	}

	return {"user": login_user.value, "pwd": login_pwd.value};	
}

export function check_sign_up(ev) {
	ev.preventDefault();
	
	if (signup_user.value.length == 0) {
		register_error("Usuario necesario", page);
		return null;
	}
	
	if (signup_pwd.value.length == 0) {
		register_error("Contraseña necesaria", page);
		return null;
	}
	
	if (signup_pwd.value != signup_pwd_rep.value) {
		register_error("Las contraseñas no coinciden", page);
		return null;
	}
	
	return {"user": signup_user.value, "pwd": signup_pwd.value};
}

function log_in_to_sign_up(ev) {
	ev.preventDefault();

	log_in.style.animation = "move_left_log-in 0.6s 1";
	sign_up.style.animation = "move_left_sign-up 0.6s 1";
	log_in.style.marginLeft = "-100vw";
	sign_up.style.marginLeft = "0vw";	
	page = 1;
	
	// Se borran inputs
	login_user.value = "";
	login_pwd.value = "";
}

function sign_up_to_log_in(ev) {
	ev.preventDefault();

	log_in.style.animation = "move_right_log-in 0.6s 1";
	sign_up.style.animation = "move_right_sign-up 0.6s 1";
	log_in.style.marginLeft = "0vw";
	sign_up.style.marginLeft = "100vw";
	page = 0;

	// Se borran inputs	
	signup_user.value = "";
	signup_pwd.value = "";
	signup_pwd_rep.value = "";
}

export function register_effective() {
	register.style.animation = "registered 0.6s 1";
	register.style.marginTop = "-100vh";
	
	window.setTimeout(() => {
		page = 0;
		log_in.style.animation = "";
		sign_up.style.animation = "";
		log_in.style.marginLeft = "0vw";
		sign_up.style.marginLeft = "100vw";
	}, 600);
	
	let name;
	if (page == 0) {
		name = login_user.value;
	}
	else {
		name = signup_user.value;
	}
	
	// Se borran inputs
	login_user.value = "";
	login_pwd.value = "";
	signup_user.value = "";
	signup_pwd.value = "";
	signup_pwd_rep.value = "";
	
	return name;
}

export function register_error(error, id) {
	if (error_id != null) {
		window.clearTimeout(error_id);
	}
	error_texts[id].innerHTML = error;
	error_texts[id].style.display = "block";
	error_id = window.setTimeout(() => {
		error_texts[id].style.display = "none";
		error_id = null;
	}, 2000);
}

function log_out() {
	register.style.animation = "log_out 0.6s 1";
	register.style.marginTop = "0vh";
}

function handle_pos(ev) {
	if (changeable) {
		if (ev.gamma > 40) {
			if (page == 0) {
				log_in_to_sign_up();
				changeable = false;
			};
		}
		else if (ev.gamma < -40) {
			if (page == 1) {
				sign_up_to_log_in();
				changeable = false;
			}
		}
	}
	else {		
		if (ev.gamma < 10 || ev.gamma > 10) {
			changeable = true;
		} 
	}
}

