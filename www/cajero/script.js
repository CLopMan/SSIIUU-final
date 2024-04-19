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
  
  mostrarInformacion(data, name)

});

});

// enseña la cesta de la copra de un usuario
function mostrarInformacion(data, username) {
  let user = username;
  const background = document.createElement("div");
  background.style.backgroundColor = "#000000";
  background.style.opacity = 0.3;
  background.style.width = "100vw";
  background.style.height = "100vh";
  background.style.position = "absolute";
  background.style.left = 0;
  background.style.top = 0;
  background.style.zIndex = 100;
  const informacionUsuario = data[username];

  // Verificar si se encontró información para el usuario
  if (!informacionUsuario) {
      console.log(`No se encontró información para el usuario "${username}"`);
      return;
  }

  // Crear elementos HTML para mostrar la información
  const cartel = document.createElement('div');
  const container = document.createElement('div');
  cartel.classList.add('cartel-se-busca');
  container.classList.add("list_cont");

  const titulo = document.createElement('h1');
  titulo.textContent = `¡SE BUSCA!`;
  const nombre = document.createElement('h2');
  const how = document.createElement('h2');
  how.textContent = "VIVO O MUERTO";
  
  titulo.classList.add("one")
  const icon = document.createElement("img");
  if (username == "Ace" || username == "ace" || username == "ACE") {
    user = "Ace D. Donut";
    icon.src = "miscelaneous/Ace.webp"
    how.textContent="MUERTO";

  } else if (username == "Kuina" || username == "kuina" || username == "KUINA") {
    user = "Kuina Down D. Stairs";
    icon.src = "miscelaneous/kuina.webp"
    how.textContent="MUERTA";
  } else if (username == "Roberto" || username == "roberto" || username == "ROBERTO") {
    icon.src = "miscelaneous/200w.gif";
    const player = new Audio("miscelaneous/nothingSuspicious.mp3");
    player.play();
    setTimeout(() => {player.pause();}, 6000);
  } else {
    //icon.src = "https://thispersondoesnotexist.com/";
    icon.src = "user-solid.svg";
  }
  nombre.textContent = `${user}`;
  const lista = document.createElement('ul');

  // Iterar sobre las entradas de información del usuario
  var total = 0;
  for (const id in informacionUsuario) {
      if (Object.hasOwnProperty.call(informacionUsuario, id)) {
          const tipo = informacionUsuario[id].tipo;
          const precio = informacionUsuario[id].precio;
          total += precio; 
          const elementoLista = document.createElement('li');
          elementoLista.textContent = `${tipo}---${precio}€`;
          lista.appendChild(elementoLista);
      }
  }
  const etotal = document.createElement('p');
  etotal.textContent = `TOTAL: ${redondear(total, 2)}€`;
  etotal.classList.add("total");
  const hr = document.createElement("p");
  const hr2 = document.createElement("p");
  hr.textContent="-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
  hr2.textContent=hr.textContent;
  cartel.appendChild(titulo);
  cartel.appendChild(how);
  cartel.appendChild(hr);
  //cartel.appendChild(icon_div);
  cartel.appendChild(icon);
  cartel.appendChild(hr2);
  cartel.appendChild(nombre);
  container.appendChild(lista);
  container.appendChild(etotal);
  cartel.appendChild(container);

  cartel.style.opacity = 1.0;  
  closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", () => {
    location.reload();
  });

  // Agregar el cartel al cuerpo del documento HTML
  document.body.appendChild(cartel);
  document.body.appendChild(background);
  cartel.appendChild(closeButton);
}


function redondear(num, decimales) {
  let factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
}



