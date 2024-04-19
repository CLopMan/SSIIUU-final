const socket = io();

const qr = new QRCode("qrcode", {
  text: "PAGO",
  width: 512,
  height: 512,
  colorDark: "#000000",
  colorLight: "transparent",
  correctLevel: QRCode.CorrectLevel.H
});

// conexion 
socket.on("connect", () => {
  socket.emit("CASHIER_CONNECTED", { id: 1 });

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK");
  });

// Escuchar el evento 'jsonData' del servidor
socket.on('jsonData', (data, name) => {
  console.log("Datos JSON recibidos del servidor:", data );
  
  document.getElementById("qrcode").style.display="none";
  mostrarInformacion(data, name)

});

});

// enseña la cesta de la copra de un usuario
function mostrarInformacion(data, username) {
  const informacionUsuario = data[username];

  // Verificar si se encontró información para el usuario
  if (!informacionUsuario) {
      console.log(`No se encontró información para el usuario "${username}"`);
      return;
  }

  // Crear elementos HTML para mostrar la información
  const cartel = document.createElement('div');
  cartel.classList.add('cartel-se-busca');

  const titulo = document.createElement('h2');
  titulo.textContent = `¡SE BUSCA: ${username}!`;
  const icon = document.createElement("img");
  icon.src = "user-solid.svg";
  const lista = document.createElement('ul');

  // Iterar sobre las entradas de información del usuario
  var total = 0;
  for (const id in informacionUsuario) {
      if (Object.hasOwnProperty.call(informacionUsuario, id)) {
          const tipo = informacionUsuario[id].tipo;
          const precio = informacionUsuario[id].precio;
          total += precio; 
          const elementoLista = document.createElement('li');
          elementoLista.textContent = `${tipo}-${precio}€`;
          lista.appendChild(elementoLista);
      }
  }
  const elementoLista = document.createElement('li');
  elementoLista.textContent = `TOTAL: ${total}€`;
  lista.appendChild(elementoLista);

  cartel.appendChild(titulo);
  //cartel.appendChild(icon_div);
  cartel.appendChild(icon);
  cartel.appendChild(lista);

  // Agregar el cartel al cuerpo del documento HTML
  document.body.appendChild(cartel);
  document.body.style.backgroundColor = `linear-gradient("to bottom", #3b2916, #1b0f05);`;
}




