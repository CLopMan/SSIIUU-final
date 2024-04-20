import { reset_inventory } from "./inventario.js";

// Divs de registro
const inventario = document.getElementById("inventario");
const register = document.getElementById("register");
const log_in = document.getElementById("log-in");
const sign_up = document.getElementById("sign-up");
const error_texts = document.getElementsByClassName("register_error");

// Botones de registro
const log_out_button = document.getElementById("log-out");
const scan_button = document.getElementById("Scan");
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
log_out_button.addEventListener("touchend", log_out);
to_sign_up_button.addEventListener("touchend", log_in_to_sign_up);
to_log_in_button.addEventListener("touchend", sign_up_to_log_in);

// Listener para control por movimientos
window.addEventListener("deviceorientation", handle_pos);

// Función que checkea el log in
export function check_log_in(ev) {
    ev.preventDefault();
    
    // Si no tiene un usuario
    if (login_user.value.length == 0) {
        register_error("Usuario necesario", page);
        return null;
    }

	// Si no tiene contraseña
    if (login_pwd.value.length == 0) {
        register_error("Contraseña necesaria", page);
        return null;
    }
	
	// Se devuelven los datos del formulario
    return { user: login_user.value, pwd: login_pwd.value };
}

// Función que checkea el sign_up
export function check_sign_up(ev) {
    ev.preventDefault();

	// Si no tiene un usuario
    if (signup_user.value.length == 0) {
        register_error("Usuario necesario", page);
        return null;
    }

	// Si no tiene contraseña
    if (signup_pwd.value.length == 0) {
        register_error("Contraseña necesaria", page);
        return null;
    }

	// Si las contraseñlas no coinciden
    if (signup_pwd.value != signup_pwd_rep.value) {
        register_error("Las contraseñas no coinciden", page);
        return null;
    }

	// Se devuelven los datos del formulario
    return { user: signup_user.value, pwd: signup_pwd.value };
}

// Función que transiciona de log in a sign up
function log_in_to_sign_up(ev) {
    ev.preventDefault();

	// Se aplican las animaciones
    log_in.style.animation = "move_left_log-in 0.6s 1";
    sign_up.style.animation = "move_left_sign-up 0.6s 1";
    log_in.style.marginLeft = "-100vw";
    sign_up.style.marginLeft = "0vw";
    page = 1;

    // Se borran inputs
    login_user.value = "";
    login_pwd.value = "";
}

// Función que transiciona de sign up a log in
function sign_up_to_log_in(ev) {
    ev.preventDefault();

	// Se aplican las animaciones
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

// Función que controla que pasa si el log in o el sign up es correcto
export function register_effective() {
	// Se aplican las animaciones
    register.style.animation = "registered 0.6s 1";
    register.style.marginTop = "-100vh";
    inventario.style.display = "block";

	// Cuando se vea el inventario, se resetea el menú de registro
    window.setTimeout(() => {
        page = 0;
        log_in.style.animation = "";
        sign_up.style.animation = "";
        log_in.style.marginLeft = "0vw";
        sign_up.style.marginLeft = "100vw";
        log_out_button.style.display = "block";
        scan_button.style.display = "block";
        register.style.display = "none";
    }, 600);

	// Guarda el nombre del usuario
    let name;
    if (page == 0) {
        name = login_user.value;
    } else {
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

// Función que hace aparecer los errores del registro
export function register_error(error, id) {
    
    // Si hay un error, se evita que desaparezca
    if (error_id != null) {
        window.clearTimeout(error_id);
    }
    
    // Se cambia el texto y el estilo del error
    error_texts[id].innerHTML = error;
    error_texts[id].style.display = "block";
    
    // A los 2 segundos desaparece
    error_id = window.setTimeout(() => {
        error_texts[id].style.display = "none";
        error_id = null;
    }, 2000);
}

// Función que hace el log_out
function log_out() {
	// Resetea el inventario
	reset_inventory();
	
	// Pone las animaciones
	register.style.display = "block";
    register.style.animation = "log_out 0.6s 1";
    register.style.marginTop = "0vh";
    log_out_button.style.display = "none";
	scan_button.style.display = "none";
	
	// Cuando se acabe la animación, se esconde el inventario
	window.setTimeout(()=> {
		inventario.style.display = "none";
	}, 600);
}

// Función que checkea la posición del móvil para cambiar de pestaña de forma ubicua
function handle_pos(ev) {

	// Si se pueden cambiar las páginas
    if (changeable) {
    
    	// Si se hace un desplazamiento hacia la derecha se cambia a sign up, si es a la izquierda, se cambia a log in
        if (ev.gamma > 40) {
            if (page == 0) {
                log_in_to_sign_up(ev);
                changeable = false;
            }
        } else if (ev.gamma < -40) {
            if (page == 1) {
                sign_up_to_log_in(ev);
                changeable = false;
            }
        }
    } else {
    	// Se espera a que el teléfono este en una posición neutra para reiniciar el booleano
        if (ev.gamma < 5 || ev.gamma > 5) {
            changeable = true;
        }
    }
}
