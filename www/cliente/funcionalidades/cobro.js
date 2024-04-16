import {socket} from "../script.js";
import {name} from "../script.js";

let scanButton = document.getElementById("Scan");
let inventario = document.getElementById("inventario");
let cobro = document.getElementById("cobro");


function beep(durationInSeconds) {
    // Crear un contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear un oscilador
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Tipo de onda, 'sine' es la más suave

    // Establece la frecuencia del beep (440 Hz es un tono estándar "A")
    oscillator.frequency.setValueAtTime(2*440, audioContext.currentTime);

    // Crear un nodo de ganancia para controlar el volumen
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen medio

    // Conectar el oscilador con el nodo de ganancia
    oscillator.connect(gainNode);

    // Conectar el nodo de ganancia con el destino de salida (los altavoces)
    gainNode.connect(audioContext.destination);

    // Iniciar el oscilador
    oscillator.start();

    // Calcular la duración en milisegundos
    let durationInMilliseconds = durationInSeconds * 1000;

    // Detener el oscilador después de la duración especificada
    setTimeout(() => {
        oscillator.stop();
        // Cierra el contexto de audio para liberar recursos
        audioContext.close();
    }, durationInMilliseconds);
}


const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    // handle the scanned code as you like, for example:
    if (decodedText === "PAGO") {
        navigator.vibrate([200, 50, 200]);
        beep(0.2);
        socket.emit("PAGO", name);
        html5QrcodeScanner.clear();
    }
  }
  
function onScanFailure(error) {
    
}
  
const config = { fps: 10, qrbox: { width: 600, height: 600 }, rememberLastUsedCamera: false, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]};
const html5QrCode = new Html5Qrcode(
    "reader", { formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ] });

scanButton.addEventListener("touchend", () => {
    inventario.style.display = "none";
    cobro.style.display = "flex";

    html5QrCode.start({ facingMode: { exact: "environment" } }, config, qrCodeSuccessCallback);
    let toDelete = document.getElementById("reader__dashboard_section_csr");
    toDelete.style.display="none";
});
