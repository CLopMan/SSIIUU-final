### Autores:

**Grupo: 14**

-   [Adrián Fernández Galán](https://github.com/Adri-Extremix) (100472182)
-   [Manuel Gómez-Plana Rodríguez](https://github.com/ManuGPR) (100472310)
-   [César López Mantecón](https://github.com/CLopMan) (100472092)

# SSIIUU-final

Este proyecto implementa las funcionalidades descritas en en documento desarrollado para la primera parte. La aplicación trata de ser una forma de gamificar el proceso de compra.

El prototipo está formado por un cajero y uno o varios clientes. Para acceder a los clientes se debe usar la url **localhost:3000/cliente** y para acceder a los cajeros se debe usar la url **localhost:3000/cajero**

El prototipo cuenta con 9 funcionalidades que describimos a continuación.

## Funcionalidades

Para facilitar las explicaciones, definiremos una serie de términos:

-   rotar: hablaremos de _rotar el dispositivo_ cuando este deba rotar con respecto a un eje que lo atraviese paralelamente al lado largo del móvil.
-   Girar: hablaremos de _girar el dispositivo_ cuando nos refiramos a girarlo manteniendo la pantalla mirando directamente al usuario.

### Login-register

El usuario puede identificarse mediante un nombre y una contraseña. La contraseña se cifra haciendo uso del módulo `crypto`. El usuario puede intercambiar entre los menús de registrar y e iniciar sesión mediante un giro rápido del móvil a la izquierda o derecha.

### Ordenar

La cesta de la compra viene representada por un inventario. El inventario está compuesto por casillas y se organizará de forma similar al tetris. De esta forma, un usuario debe **ordenar** bien las piezas según caen para maximizar el espacio. El inventario permite dos acciones:

-   Desplazar: las piezas se desplazan haciendo un rápido _giro_ a izquierda o derecha con el dispositivo.
-   Rotar: las piezas se rotan al _rotar el dispositivo_.

Durante la caida de una figura no se podrá interactuar con el resto de funcionalidades.

### Eliminar un objeto

En el inventario un usuario puede seleccionar un objeto pulsando sobre él. Una vez hecho, si se coloca el móvil bocabajo se eliminará un objeto.

### Marcar como favorito

Con un objeto seleccionado, se puede agitar el móvil hacia la izquierda y hacia la derecha para marcarlo como favorito representado por un cuadrado amarillo colocado sobre la esquina de la figura.

Un objeto marcado como favorito no puede ser eliminado, ni mediante la función anterior ni mediante un duelo. Un usuario sólo puede tener un objeto marcado como favorito.

### Añadir un objeto

En el inventario existe un botón marcado con un símbolo `+`. Este permite iniciar la cámara y hacer una foto a un objeto.

-   Si, después de hacer la foto, el usuario mueve el móvil a la izquierda se descarta la foto.
-   Si, después de hacer la foto, el usuario mueve el móvil a la derecha se analiza la foto y se reconoce el objeto.

Actualmente la inteligencia artificial entrenada reconoce dos tipos de objetos: una caja de fisiocrem y un sobao. En caso de necesitar reconocer más objetos bastaría con añadir las fotos suficientes a la inteligencia artificial.

### Cobro

En el cajero existe un código qr, mientras que un cliente cuenta con un botón para acceder al cobro de la aplicación. Este botón le permite escanear dicho qr y que en el cajero aparezca el conjunto de su compra, junto con la suma total.

Para el resumen de la compra, hemos decidido seguir una estética de forajidos, de la mano con la temática del duelo. Así, un cliente recibirá un cartel personalizado con su nombre y compra como si fuera un cartel de recompensa.

### Minijuego

Después de escanear un objeto, el usuario debe superar un minijuego de pesca para obtenerlo. Una vez superado una figura que representa el objeto caerá en tu inventario.

### Duelo

Dos usuarios se pueden batir en un duelo del oeste para obtener un objeto del otro. En el duelo existen dos figuras:

-   Unsuario retante: este usuario podrá mostrar un código qr al rival contra el que se quiera enfrentar.
-   Usuario retado: este usuario deberá escanear el código qr del retante, entonces se iniciará un duelo entre ambos.

En un duelo, un mensaje (acompañado de vibración) aparecerá en la pantalla de ambos contrigantes. El primero que levante el teléfono, como si fuera una pistola, vencerá y podrá robar un objeto del inventario del contraio.
