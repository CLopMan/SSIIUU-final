const register = document.getElementById("register");
const log_in = document.getElementById("log-in");
const sign_up = document.getElementById("sign-up");

const register_buttons = document.getElementsByClassName("register_button");
const log_out_button = document.getElementById("log-out");
const to_sign_up_button = document.getElementById("to_sign-up"); 
const to_log_in_button = document.getElementById("to_log-in");

to_sign_up_button.addEventListener("click", log_in_to_sign_up);
to_log_in_button.addEventListener("click", sign_up_to_log_in);
log_out_button.addEventListener("click", log_out);

for (let i = 0; i <= 1; i++) {
	register_buttons[i].addEventListener("click", register_effective);
}

function log_in_to_sign_up() {
	log_in.style.animation = "move_left_log-in 1s 1";
	sign_up.style.animation = "move_left_sign-up 1s 1";
	log_in.style.marginLeft = "-100vw";
	sign_up.style.marginLeft = "0vw";	
}

function sign_up_to_log_in() {
	log_in.style.animation = "move_right_log-in 1s 1";
	sign_up.style.animation = "move_right_sign-up 1s 1";
	log_in.style.marginLeft = "0vw";
	sign_up.style.marginLeft = "100vw";
}

function register_effective() {
	register.style.animation = "registered 1s 1";
	register.style.marginTop = "-100vh";
}

function log_out() {
	register.style.animation = "log_out 1s 1";
	register.style.marginTop = "0vh";
}
