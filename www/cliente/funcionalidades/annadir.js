import {init_minigame} from './minijuego.js';

// elementos html a rellenar
const player = document.getElementById('player');
const canvas_cont = document.getElementById("container")
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// botones
const captureButton = document.getElementById('capture');
const closeButton = document.getElementById('annadir_close_button');

let fotico = false; // controla si ya ha hecho la foto

/*=========== CAMERA Y FOTO ===========*/

const constraints = {
    audio: false,
    video:{ facingMode: { exact: "environment" } } 
};

captureButton.addEventListener('touchend', () => { // hacer foto
    canvas_cont.style.display = "flex";
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    fotico = true;
});

/*=========== FIN CAMERA Y FOTO ===========*/


/*=========== GESTOS ===========*/
let startGamma = null; 
let startTime = null; 
const minRotacion = 30; 
const movementTimeMS = 500; 

// descartar o procesar foto
function handleOrientation(event) {
    const currentGamma = event.gamma; 
    const currentTime = new Date().getTime(); 

    
    if (startGamma === null || startTime === null) { // inicializar 
        startGamma = currentGamma;
        startTime = currentTime;
    } else {
        const gammaDiff = currentGamma - startGamma; 
        const timeDiff = currentTime - startTime; 
        if (fotico) {
            if (gammaDiff >= minRotacion && timeDiff <= movementTimeMS) { // derecha
                document.getElementById("annadir").style.display="none";
                var tr = player.srcObject.getTracks();
                tr[0].stop(); // para la cámara
                predict();
                init_minigame() // ir al minijuego
                fotico = false; 
                startGamma = null;
                startTime = null;
            } else if (gammaDiff < -minRotacion && timeDiff <= movementTimeMS) { // izquierda
                console.log("eliminar foto");
                // descartar foto
                canvas_cont.classList.add("animate-left")
                window.setTimeout(() => {
                    canvas_cont.style.display = "none";
                    canvas_cont.classList.remove("animate-left");
                }, 500);
                // reinicializar valores
                startGamma = null;
                startTime = null;
                fotico = false;
            } else if (timeDiff > movementTimeMS) { // se ha pasado el tiempo 
                
                startGamma = currentGamma;
                startTime = currentTime;
            }

        }
        
    }
}

window.addEventListener('deviceorientation', handleOrientation);
var fav;
const annadir_div = document.getElementById("annadir");


/*=========== FIN GESTOS ===========*/


/*=========== IA - TEACHABLE MACHINE ===========*/ 
export let last_predict; 
let model;
const URL = "https://teachablemachine.withgoogle.com/models/h8pgHqUIh/";
async function init () {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const weightsURL = URL + "weights.bin";
    model = await tmImage.load(modelURL, metadataURL);
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(canvas);
    last_predict = (prediction[0].probability > prediction[1].probability)? prediction[0].className : prediction[1].className;
    console.log(last_predict);
}

/*=========== FIN - TEACHABLE MACHINE ===========*/ 

/*=========== BOTONES NAVEGACIÓN ===========*/ 

// entrar a "annadir objeto"
document.getElementById("add_button").addEventListener("touchend", () => {
    console.log("add");
    canvas_cont.style.display = "none";
    annadir_div.style.display = "flex";
    fav = document.querySelectorAll(".favorito")

    init(); 
    fav.forEach( (e => {e.style.display = "none"}));
    fotico = false;


    // mostrar foto
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        player.srcObject = stream;
    });
});

// salir 
closeButton.addEventListener("touchend", () => {
    annadir_div.style.display = "none"; 
    fav.forEach( (e => {e.style.display = "block"}));
    var tr = player.srcObject.getTracks();
    tr[0].stop();
});



/*=========== FIN BOTONES NAVEGACIÓN ===========*/ 
