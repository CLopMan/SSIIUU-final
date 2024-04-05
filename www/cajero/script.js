const socket = io();

const qrcode = new QRCode("qrcode", {
  text: "index.html",
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


});


