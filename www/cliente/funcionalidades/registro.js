const register = document.getElementById("register");
const log_in = document.getElementById("log-in");
const sign_up = document.getElementById("sign-up");

const register_buttons = document.getElementsByClassName("register_button");
const log_out_button = document.getElementById("log-out");
const to_sign_up_button = document.getElementById("to_sign-up"); 
const to_log_in_button = document.getElementById("to_log-in");

var changeable = false;
var page = 0; // 0 = log-in, 1 = sign-up
var gamma;

to_sign_up_button.addEventListener("click", log_in_to_sign_up);
to_log_in_button.addEventListener("click", sign_up_to_log_in);
log_out_button.addEventListener("click", log_out);

for (let i = 0; i <= 1; i++) {
	register_buttons[i].addEventListener("click", register_effective);
}

window.addEventListener("deviceorientation", handle_pos);

function log_in_to_sign_up() {
	log_in.style.animation = "move_left_log-in 0.6s 1";
	sign_up.style.animation = "move_left_sign-up 0.6s 1";
	log_in.style.marginLeft = "-100vw";
	sign_up.style.marginLeft = "0vw";	
	page = 1;
}

function sign_up_to_log_in() {
	log_in.style.animation = "move_right_log-in 0.6s 1";
	sign_up.style.animation = "move_right_sign-up 0.6s 1";
	log_in.style.marginLeft = "0vw";
	sign_up.style.marginLeft = "100vw";
	page = 0;
}

function register_effective(ev) {
	ev.preventDefault();
	register.style.animation = "registered 0.6s 1";
	register.style.marginTop = "-100vh";
}

function log_out() {
	register.style.animation = "log_out 0.6s 1";
	register.style.marginTop = "0vh";
}

function handle_pos(ev) {
	if (changeable) {
		if (ev.gamma > 40) {
			console.log(ev.gamma);
			if (page == 0) {
				log_in_to_sign_up();
				changeable = false;
			};
		}
		else if (ev.gamma < -40) {
			console.log(ev.gamma);
			if (page == 1) {
				sign_up_to_log_in();
				changeable = false;
			}
		}
	}
	else {		
		window.setTimeout(() => {
			changeable = true;
		}, 1000);
	}
}
