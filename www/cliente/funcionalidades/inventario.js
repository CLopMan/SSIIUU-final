const ANCHO_FIGURA = 2;
const ALTURA_FIGURA = 3;
const FILAS_MATRIZ = 8;
const COLUMNAS_MATRIZ = 6;

class Figura {
    constructor(x, y, color) {
        this.height = ALTURA_FIGURA;
        this.width = ANCHO_FIGURA;
        this.orientacion = 0;
        this.x = x;
        this.y = y;
        this.colocada = false;
        this.color = color;
    }
}

let lista_figuras = [];
let div_figuras = [];
let i_figura = -1;
const matriz_figuras = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];
let figura_actual;

// Generar las celdas del juego de Tetris
const grid = document.getElementById("grid");
let cells = [];
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 6; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
        cells.push(cell);
    }
}

function printMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        console.log(matrix[i].join(" "));
    }
}

function dibujarFiguraEnMatriz() {
    console.log(figura_actual.x, figura_actual.y);
    console.log(figura_actual.height, figura_actual.width);
    for (let i = 0; i < figura_actual.height; i++) {
        for (let j = 0; j < figura_actual.width; j++) {
            matriz_figuras[figura_actual.y + i][figura_actual.x + j] = 1;
        }
    }
    console.log(matriz_figuras);
}

function moverFiguraIzquierda() {
    if (figura_actual.x + figura_actual.width < COLUMNAS_MATRIZ) {
        let colision = false;
        for (let i = 0; i < figura_actual.height && !colision; i++) {
            if (
                matriz_figuras[figura_actual.y + i][
                    figura_actual.x + figura_actual.width
                ] === 1
            ) {
                colision = true;
            }
        }
        if (!colision) {
            figura_actual.x++;
            window.navigator.vibrate(200);
        }
    }
}

function colocarBloque() {
    let div_figura = document.createElement("div");

    let x = figura_actual.x;
    let y = figura_actual.y;
    let index_width = figura_actual.x + figura_actual.width;
    let index_height =
        (figura_actual.y + figura_actual.height) * COLUMNAS_MATRIZ;
    let celda_width = cells[index_width];
    let celda_height = cells[index_height];

    /* for (let i = 0; i < figura_actual.height; i++) {
        for (let j = 0; j < figura_actual.width; j++) {
            const index =
                (figura_actual.y + i) * COLUMNAS_MATRIZ + (figura_actual.x + j);
        }
    } */
}

function moverFiguraDerecha() {
    if (figura_actual.x > 0) {
        let colision = false;
        for (let i = 0; i < figura_actual.height && !colision; i++) {
            if (
                matriz_figuras[figura_actual.y + i][figura_actual.x - 1] === 1
            ) {
                colision = true;
            }
        }
        if (!colision) {
            figura_actual.x--;
            window.navigator.vibrate(200);
        }
    }
}

function moverFiguraAbajo() {
    if (!colisionAbajo()) {
        figura_actual.y++;
        window.navigator.vibrate(200);
        // Actualizar visualización o lógica relacionada con el movimiento
    } else {
        // La figura ha llegado al final, puedes hacer algo aquí como colocarla o generar una nueva figura.
        colocarBloque();
        dibujarFiguraEnMatriz();
        generar_bloque();
    }
}

function colisionAbajo() {
    // Verificar si hay una colisión con otra figura o el borde inferior
    if (figura_actual.y + figura_actual.height >= FILAS_MATRIZ) {
        return true; // Hay una colisión con el borde inferior
    }
    for (let i = 0; i < figura_actual.width; i++) {
        if (
            matriz_figuras[figura_actual.y + figura_actual.height][
                figura_actual.x + i
            ] === 1
        ) {
            return true; // Hay una colisión con otra figura
        }
    }
    return false; // No hay colisión
}

function rotarFiguraDerecha() {
    const nuevaAltura = figura_actual.width;
    const nuevaAnchura = figura_actual.height;
    const nuevaMatriz = [];
    for (let i = 0; i < nuevaAltura; i++) {
        nuevaMatriz[i] = [];
        for (let j = 0; j < nuevaAnchura; j++) {
            nuevaMatriz[i][j] =
                matriz_figuras[figura_actual.y + j][
                    figura_actual.x + nuevaAnchura - i - 1
                ];
        }
    }
    if (!hayColision(nuevaMatriz)) {
        figura_actual.height = nuevaAltura;
        figura_actual.width = nuevaAnchura;
        figura_actual.orientacion = (figura_actual.orientacion + 1) % 4;
        for (let i = 0; i < nuevaAltura; i++) {
            for (let j = 0; j < nuevaAnchura; j++) {
                matriz_figuras[figura_actual.y + i][figura_actual.x + j] =
                    nuevaMatriz[i][j];
            }
        }
        window.navigator.vibrate(200);
    }
}

function rotarFiguraIzquierda() {
    const nuevaAltura = figura_actual.width;
    const nuevaAnchura = figura_actual.height;
    const nuevaMatriz = [];
    for (let i = 0; i < nuevaAltura; i++) {
        nuevaMatriz[i] = [];
        for (let j = 0; j < nuevaAnchura; j++) {
            nuevaMatriz[i][j] =
                matriz_figuras[figura_actual.y + nuevaAltura - j - 1][
                    figura_actual.x + i
                ];
        }
    }
    if (!hayColision(nuevaMatriz)) {
        figura_actual.height = nuevaAltura;
        figura_actual.width = nuevaAnchura;
        figura_actual.orientacion = (figura_actual.orientacion + 3) % 4;
        for (let i = 0; i < nuevaAltura; i++) {
            for (let j = 0; j < nuevaAnchura; j++) {
                matriz_figuras[figura_actual.y + i][figura_actual.x + j] =
                    nuevaMatriz[i][j];
            }
        }
        window.navigator.vibrate(200);
    }
}

function hayColision(nuevaMatriz) {
    for (let i = 0; i < nuevaMatriz.length; i++) {
        for (let j = 0; j < nuevaMatriz[i].length; j++) {
            if (
                nuevaMatriz[i][j] === 1 &&
                (figura_actual.y + i >= FILAS_MATRIZ ||
                    figura_actual.x + j >= COLUMNAS_MATRIZ ||
                    figura_actual.y + i < 0 ||
                    figura_actual.x + j < 0 ||
                    matriz_figuras[figura_actual.y + i][figura_actual.x + j] ===
                        1)
            ) {
                return true;
            }
        }
    }
    return false;
}

function generar_bloque() {
    figura_actual = new Figura(0, 0, "#8f90b5");
    lista_figuras.push(figura_actual);
}

function dibujar_figuras() {
    for (let cell of cells) {
        cell.style.backgroundColor = "#3c2012";
    }
    for (let figura of lista_figuras) {
        for (let i = 0; i < figura.height; i++) {
            for (let j = 0; j < figura.width; j++) {
                if (
                    figura.y + i >= 0 &&
                    figura.y + i < FILAS_MATRIZ &&
                    figura.x + j >= 0 &&
                    figura.x + j < COLUMNAS_MATRIZ
                ) {
                    const index =
                        (figura.y + i) * COLUMNAS_MATRIZ + (figura.x + j);
                    cells[index].style.backgroundColor = figura.color;
                }
            }
        }
    }
}

setInterval(dibujar_figuras, 1000);
generar_bloque();
setInterval(moverFiguraAbajo, 3000);
let startAngle = {};
let startTime = null;
let isLocked = false; // nuevo estado de bloqueo
const lockTimeMS = 500; // tiempo de bloqueo después de detectar un giro
window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
    if (isLocked) return;
    const currentAngle = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
    };
    const minRotacionAlpha = 30;
    const minRotacionGamma = 50;

    const movementTimeMS = 300;

    const currentTime = new Date().getTime();

    if (startTime === null) {
        // inicializar
        startAngle = { ...currentAngle };
        startTime = currentTime;
    } else {
        const AngleDiff = {};
        AngleDiff.alpha = currentAngle.alpha - startAngle.alpha;
        AngleDiff.beta = currentAngle.beta - startAngle.beta;
        AngleDiff.gamma = currentAngle.gamma - startAngle.gamma;

        const timeDiff = currentTime - startTime;

        if (AngleDiff.alpha >= minRotacionAlpha && timeDiff <= movementTimeMS) {
            // derecha
            moverFiguraDerecha();
            dibujar_figuras();

            isLocked = true; // bloquear la detección de giros
            setTimeout(() => {
                isLocked = false; // desbloquear después de lockTimeMS
            }, lockTimeMS);
            startAngle = { ...currentAngle };
            startTime = currentTime;
        } else if (
            AngleDiff.alpha < -minRotacionAlpha &&
            timeDiff <= movementTimeMS
        ) {
            // izquierda
            moverFiguraIzquierda();
            dibujar_figuras();

            isLocked = true; // bloquear la detección de giros
            setTimeout(() => {
                isLocked = false; // desbloquear después de lockTimeMS
            }, lockTimeMS);
            startAngle = { ...currentAngle };
            startTime = currentTime;
        } else if (
            AngleDiff.gamma >= minRotacionGamma &&
            timeDiff <= movementTimeMS
        ) {
            // rotar derecha
            rotarFiguraDerecha();
            dibujar_figuras();

            isLocked = true; // bloquear la detección de giros
            setTimeout(() => {
                isLocked = false; // desbloquear después de lockTimeMS
            }, lockTimeMS);
            startAngle = { ...currentAngle };
        } else if (
            AngleDiff.gamma < -minRotacionGamma &&
            timeDiff <= movementTimeMS
        ) {
            //rotar izquierda
            rotarFiguraIzquierda();
            dibujar_figuras();
            isLocked = true; // bloquear la detección de giros
            setTimeout(() => {
                isLocked = false; // desbloquear después de lockTimeMS
            }, lockTimeMS);
            startAngle = { ...currentAngle };
        } else if (timeDiff > movementTimeMS) {
            // se ha pasado el tiempo
            startAngle = { ...currentAngle };
            startTime = currentTime;
        }
    }
}
