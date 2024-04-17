import {init_minigame} from './minijuego.js';

// elementos html a rellenar
const player = document.getElementById('player');
const canvas_cont = document.getElementById("container")
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const closeButton = document.getElementById('annadir_close_button');

let fotico = false; // controla si ya ha hecho la foto

// camara trasera y sin audio
const constraints = {
    audio: false,
    video:{ facingMode: { exact: "environment" } } 
};

captureButton.addEventListener('touchend', () => { // hacer foto
    canvas_cont.style.display = "flex";
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    fotico = true;
});



// gestos 
let startGamma = null; 
let startTime = null; 
const minRotacion = 30; 
const movementTimeMS = 500; 

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
                tr[0].stop();
                predict();
                init_minigame() // ir al minijuego
                fotico = false; 
                startGamma = null;
                startTime = null;
            } else if (gammaDiff < -minRotacion && timeDiff <= movementTimeMS) { // izquierda
                console.log("eliminar foto");

                canvas_cont.classList.add("animate-left")
                window.setTimeout(() => {
                    canvas_cont.style.display = "none";
                    canvas_cont.classList.remove("animate-left");
                }, 500);
                
        
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

const annadir_div = document.getElementById("annadir");
const inventario = document.getElementById("inventario");
document.getElementById("add_button").addEventListener("touchend", () => {
    canvas_cont.style.display = "none";
    init(); 
    //inventario.style.display = "none";
    annadir_div.style.display="flex";
    fotico = false;


    // mostrar foto
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        player.srcObject = stream;
});
});

// IA - Teachable machine 
export let last_predict; 
let model;
const URL = "https://teachablemachine.withgoogle.com/models/h8pgHqUIh/";
async function init () {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const weightsURL = URL + "weights.bin";
    //model = await tmImage.loadFromFiles(uploadModelFile.files[0], uploadWeights.files[0], uploadDataFile[0])
    model = await tmImage.load(modelURL, metadataURL);
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(canvas);
    last_predict = (prediction[0].probability > prediction[1].probability)? prediction[0].className : prediction[1].className;
    console.log(last_predict);
}

closeButton.addEventListener("touchend", () => {
    //inventario.style.display = "flex";
    annadir_div.style.display = "none"; 
    var tr = player.srcObject.getTracks();
    tr[0].stop();
});