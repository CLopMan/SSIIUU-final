import {init_minigame} from './minijuego.js';

// elementos html a rellenar
const player = document.getElementById('player');
const canvas_cont = document.getElementById("container")
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');

let fotico = false; // controla si ya ha hecho la foto

// camara trasera y sin audio
const constraints = {
    audio: false,
    video:{ facingMode: { exact: "environment" } } 
};

captureButton.addEventListener('touchend', () => { // hacer foto
    canvas_cont.style.display = "flex"
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    fotico = true;
});

// mostrar foto
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        player.srcObject = stream;
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
                init_minigame() // ir al minijuego
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

