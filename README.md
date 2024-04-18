# SSIIUU-final
Este proyecto implementa las funcionalidades descritas en en documento desarrollado para la primera parte. La aplicación trata de ser una forma de gamificar el proceso de compra. 

El prototipo cuenta con 9 funcionalidades que describimos a continuación. 

## Funcionalidades
Para facilitar las explicaciones, definiremos una serie de términos: 
- rotar: hablaremos de *rotar el dispositivo* cuando este deba rotar con respecto a u eje que lo atraviese paralelamente al lado largo del móvil. 
- Girar: hablaremos de *girar el dispositivo* cuando nos refiramos a girarlo manteniendo la pantalla mirando directamente al usuario. 

### Login-register
El usuario puede identificarse mediante un nombre y una constraseña. La contraseña se cifra haciendo uso del módulo `crypto`. 

### Ordenar  
La cesta de la compra viene representada por un inventario. El inventario está compuesto por casillas y se organizará de forma similar al tetris. De esta forma, un usuario debe **ordenar** bien las piezas según caen para maximizar el espacio. . El inventario permite dos acciones: 
- Deslplazar: las piezas se desplazan haciendo un rápido movimiento a izquierda o derecha con el dispositivo. 
- Rotar: las piezas se rotan al rotar el dispositivo. 

### Eliminar un objeto
En el inventario un usuario puede seleccionar un objeto pulsando sobre él. Una vez hecho, si se coloca el móvil bocabajo se eliminará un objeto. 

### Marcar como favorito
Con un objeto seleccionado, se puede agitar el móvil adelante y hacia atrás para marcarlo como favorito. Sólo se podrá marcar como favorito un objeto, representado por un cuadrado amarillo colocado sobre la esquina de la figura. 

Un objto marcado como favorito no puede ser eliminado, ni mediante la función anterior ni mediante un duelo.

### Añadir un objeto
En el inventario existe un botón marcado con un símbolo `+`. Este permite iniciar la cámara y hacer una foto a un objeto. 
- Si, después de hacer la foto, el usuario mueve el móvil a la izquierda se descarta la foto. 
- Si, después de hacer la foto, el usuario mueve el móvil a la derecha se analiza la foto y se reconoce el objeto. 

Actualmente la inteligencia artificial entrenada reconoce dos tipos de objetos: una caja de fisiocrem y un sobao. En caso de necesitar reconocer más objetos bastaría con añadir las fotos suficientes a la inteligencia artificial. 

### Cobro 
En el cajero existe un código qr, mientras que un cliente cuenta con un botón para acceder al cobro de la aplicación. Este botón le permite escanear dicho qr y que en el cajero aparezca el conjunto de su compra, junto con la suma total. 

### Minijuego 
Después de escanear un objeto, el usuario debe superar un minijuego de pesca para obtenerlo. Una vez superado una figura que representa el objeto caerá en tu inventario.

### Duelo 
Dos usuarios se pueden batir en un duelo del oeste para obtener un objeto del otro. 