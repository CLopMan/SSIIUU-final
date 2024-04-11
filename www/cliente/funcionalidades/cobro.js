import qrcode from "qrcode";

const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// camara trasera y sin audio
const constraints = {
    audio: false,
    video:{ facingMode: { exact: "environment" } } 
};

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        player.srcObject = stream;
});

