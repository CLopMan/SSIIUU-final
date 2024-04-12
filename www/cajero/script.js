const socket = io();

const qr = new QRCode("qrcode", {
  text: "PAGO",
  width: 512,
  height: 512,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});
socket.on("connect", () => {
  socket.emit("CASHIER_CONNECTED", { id: 1 });

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK");
  });
// Escuchar el evento 'jsonData' del servidor
socket.on('jsonData', (data) => {
  console.log('Datos JSON recibidos del servidor:', data);
  // Aquí puedes hacer lo que quieras con los datos recibidos
});

});


