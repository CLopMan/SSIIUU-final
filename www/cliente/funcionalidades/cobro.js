import {socket} from "../script.js";
import {name} from "../script.js";

let scanButton = document.getElementById("Scan");
let closeButton = document.getElementById("scan_close_button");
let inventario = document.getElementById("inventario");
let cobro = document.getElementById("cobro");


/* =========== BEEP LIKE A CASHIER, CHICLIN BABY =========== */
function beep(durationInSeconds) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Tipo de onda, 'sine' es la más suave

    oscillator.frequency.setValueAtTime(2*440, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen medio

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.start();

    let durationInMilliseconds = durationInSeconds * 1000;

    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, durationInMilliseconds);
}
/* =========== FIN BEEP =========== */

/* =========== QR CODE =========== */
let finish = false;
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    if (decodedText === "PAGO") { // qr de cajero leido
        navigator.vibrate([200, 50, 200]);
        beep(0.2);
        socket.emit("PAGO", name);
        html5QrCode.stop();
        finish = true;
    }
}

  
  
const config = { fps: 10, qrbox: { width: 600, height: 600 }, rememberLastUsedCamera: false, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]};
const html5QrCode = new Html5Qrcode( // scanner 
    "reader", { formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ] });
/* =========== FIN QR CODE =========== */

/* =========== BOTONES BEEP =========== */
// entrar 
scanButton.addEventListener("touchend", () => {
    cobro.style.display = "flex";
    finish = false;
    document.querySelectorAll(".favorito").forEach((e) => {e.style.display = "none"});
    html5QrCode.start({ facingMode: { exact: "environment" } }, config, qrCodeSuccessCallback);
    let toDelete = document.getElementById("reader__dashboard_section_csr");
    
    if (toDelete != null){toDelete.style.display="none";}
});


// salir
closeButton.addEventListener("touchend", () => {
    document.querySelectorAll(".favorito").forEach((e) => {e.style.display = "block"});
    cobro.style.display = "none"; 
    if (!finish) {
        html5QrCode.stop();

    }
});
/* =========== FIN BOTONES =========== */
