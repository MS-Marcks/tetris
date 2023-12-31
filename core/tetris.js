const readline = require('readline');
const figlet = require("figlet");
require("./core/colors");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const vacio = "⬜";
const relleno = "🔳";

let figuras = [
    {
        tamanio: {
            x: 2,
            y: 2,
        },
        desplazimiento: {
            punto1: {
                x: 2,
                y: 2,
            },
            punto2: {
                x: 2,
                y: 2,
            }
        },
        nombre: "o",
        figura: [
            [{ value: (relleno), colision: true }, { value: (relleno), colision: true }],
            [{ value: (relleno), colision: true }, { value: (relleno), colision: true }]
        ]
    },
    {
        tamanio: {
            x: 1,
            y: 4,
        },
        desplazimiento: {
            punto1: {
                x: 1,
                y: 0,
            },
            punto2: {
                x: 1,
                y: 4,
            }
        },
        nombre: "l",
        figura: [
            [{ value: (relleno), colision: true }],
            [{ value: (relleno), colision: true }],
            [{ value: (relleno), colision: true }],
            [{ value: (relleno), colision: true }]
        ]
    },
    {
        tamanio: {
            x: 3,
            y: 2,
        },
        desplazimiento: {
            punto1: {
                x: 3,
                y: 2,
            },
            punto2: {
                x: 3,
                y: 2,
            }
        },
        name: "s",
        figura: [
            [{ value: vacio, colision: false }, { value: (relleno), colision: true }, { value: (relleno), colision: true }],
            [{ value: (relleno), colision: true }, { value: (relleno), colision: true }, { value: vacio, colision: false }]
        ]
    },
    {
        tamanio: {
            x: 3,
            y: 2,
        },
        desplazimiento: {
            punto1: {
                x: 3,
                y: 2,
            },
            punto2: {
                x: 3,
                y: 2,
            }
        },
        nombre: "t",
        figura: [
            [{ value: vacio, colision: false }, { value: (relleno), colision: true }, { value: vacio, colision: false }],
            [{ value: (relleno), colision: true }, { value: (relleno), colision: true }, { value: (relleno), colision: true }]
        ]
    },
    {
        tamanio: {
            x: 3,
            y: 2
        },
        desplazimiento: {
            punto1: {
                x: 3,
                y: 2
            },
            punto2: {
                x: 3,
                y: 2
            }
        },
        nombre: "L",
        figura: [
            [{ value: (relleno), colision: true }, { value: vacio, colision: false }, { value: vacio, colision: false }],
            [{ value: (relleno), colision: true }, { value: (relleno), colision: true }, { value: (relleno), colision: true }]
        ]
    }
];

let tablero = [];

const TotaldeFilas = 29;
const TotaldeColumas = 24;

var figura;
var figuraenMovimiento = false;
var Noseguir = false;
var puntos = 0;
var x = 0;
var y = 0;
var entoncesRotar = false;
var respaldo;

function ObtenerFigura() {
    figura = JSON.parse(JSON.stringify(figuras[Math.round((Math.random() * (figuras.length - 1)))]));
    //figura = JSON.parse(JSON.stringify(figuras[4]));
    figura.desplazimiento.punto1.x = Math.round((Math.random() * ((TotaldeColumas) - figura.tamanio.x)));
    figura.desplazimiento.punto2.x = figura.desplazimiento.punto1.x + figura.tamanio.x;
    figura.desplazimiento.punto2.y = figura.tamanio.y;
}

function Frame() {
    if (!figuraenMovimiento) {
        ObtenerFigura();
        figuraenMovimiento = true;
    }
    x = 0;
    y = 0;

    if (entoncesRotar) {
        entoncesRotar = false;
        return;
    }

    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if ((j >= (figura.desplazimiento.punto1.x) && j < (figura.desplazimiento.punto2.x) && i >= figura.desplazimiento.punto1.y && i < (figura.desplazimiento.punto2.y)) && !Noseguir) {
                if (!tablero[i][j].lock) {
                    tablero[i][j].value = figura.figura[x][y].value;
                    tablero[i][j].colision = figura.figura[x][y].colision;
                }
                y++;
            } else {
                if (!tablero[i][j].lock) {
                    tablero[i][j].value = vacio;
                    tablero[i][j].colision = false;
                }
            }
        }
        colision();
        if (y === figura.tamanio.x) {
            x++;
            y = 0;
        }
    }
}

function colision() {
    for (let k = 0; k < figura.tamanio.y; k++) {
        for (let q = 0; q < figura.tamanio.x; q++) {
            if (tablero[figura.desplazimiento.punto1.y + k][figura.desplazimiento.punto1.x + q].lock === true && figura.figura[k][q].colision === true) {
                Noseguir = true;
                BloqearEspacios();
            }
        }
    }
}

function BloqearEspacios() {
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j].value.indexOf(relleno) !== -1) {
                tablero[i][j].lock = true;
                tablero[i][j].colision = true;
            } else {
                tablero[i][j].lock = false;
                tablero[i][j].colision = false;
            }
        }
    }
}

function LiberarEspacios() {
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j].delete === true) {
                tablero[i][j].lock = false;
                tablero[i][j].delete = false;
                tablero[i][j].colision = false;
                tablero[i][j].value = vacio;
            }
        }
    }
}

function ObtenerPuntos() {
    let puntosAnteriores = puntos;
    for (let i = 0; i < tablero.length; i++) {
        let puntosLocales = 0;
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j].value.indexOf(relleno) !== -1) {
                puntosLocales++;
            }
        }
        if (puntosLocales === (tablero[i].length)) {
            puntos += puntosLocales;
            for (let j = 0; j < tablero[i].length; j++) {
                if (tablero[i][j].value.indexOf(relleno) !== -1) {
                    tablero[i][j].delete = true;
                }
            }
        }
    }

    if (puntos > puntosAnteriores) {
        while (true) {
            LiberarEspacios();
            let seMueve = false;
            for (let i = 0; i < tablero.length; i++) {
                for (let j = 0; j < tablero[i].length; j++) {
                    if (tablero[i][j].value.indexOf(relleno) !== -1 && tablero[i + 1][j].value.indexOf(vacio) !== -1 && tablero[i + 1][j].limite === false) {
                        tablero[i + 1][j].value = tablero[i][j].value;
                        tablero[i + 1][j].delete = false;
                        tablero[i + 1][j].lock = true;
                        tablero[i + 1][j].colision = true;
                        tablero[i][j].delete = true;
                        seMueve = true;
                    }
                }
            }
            if (!seMueve) {
                break;
            }
        }
    }
}

function cabezera() {
    let columna = "\t\t\t";
    console.log(blue(figlet.textSync("" + puntos, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function rotar() {
    respaldo = JSON.stringify(tablero);
    let FiguraTemporal = JSON.parse(JSON.stringify(figura.figura));
    const filas = FiguraTemporal.length;
    const columnas = FiguraTemporal[0].length;
    const rotacion = [];
    for (let i = 0; i < columnas; i++) {
        rotacion[i] = [];
    }
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            rotacion[j][filas - i - 1] = FiguraTemporal[i][j];
        }
    }
    const punto1 = JSON.parse(JSON.stringify(figura.desplazimiento.punto1));
    const punto2 = JSON.parse(JSON.stringify(figura.desplazimiento.punto2));

    figura.desplazimiento.punto1 = {
        x: punto1.x,
        y: punto1.y
    }
    figura.desplazimiento.punto2 = {
        x: (punto1.x + figura.tamanio.y),
        y: (punto1.y + figura.tamanio.x)
    };

    figura.tamanio.x = filas;
    figura.tamanio.y = columnas;
    figura.figura = rotacion;

    try {
        colision();
    } catch (error) {
        tablero = JSON.parse(respaldo);
        figura.desplazimiento.punto1 = punto1;
        figura.desplazimiento.punto2 = punto2;
        figura.tamanio.x = columnas;
        figura.tamanio.y = filas;
        figura.figura = FiguraTemporal;
    }
}

function prepararTablero() {
    for (let i = 0; i < TotaldeFilas; i++) {
        tablero.push([]);
        for (let j = 0; j < TotaldeColumas; j++) {
            if (i < 2 || i >= (TotaldeFilas - 1)) {
                tablero[i].push({ value: vacio, lock: false, delete: false, limite: true })
            } else {
                tablero[i].push({ value: vacio, lock: false, delete: false, limite: false })
            }
        }
    }
}
function dibujarPantalla() {
    let tableroFinal = [];
    for (let i = 0; i < tablero.length; i++) {
        let columna = "\t\t\t";
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j].limite !== true) {
                columna += tablero[i][j].value;
            }
        }
        if (columna.trim() !== "") {
            tableroFinal.push(columna);
        }
    }
    return tableroFinal;
}

async function jugar() {
    if (tablero.length === 0) {
        prepararTablero();
    }

    //    while (true) {
    if (entoncesRotar) {
        rotar();
    }
    //cabezera();
    Frame();
    
    //console.log("Puntos=", puntos);

    if (!entoncesRotar) {
        figura.desplazimiento.punto1.y += 1;
        figura.desplazimiento.punto2.y = figura.tamanio.y + figura.desplazimiento.punto1.y;
    }

    if ((TotaldeFilas) === (figura.desplazimiento.punto2.y) || Noseguir) {
        BloqearEspacios();
        ObtenerPuntos();
        LiberarEspacios();
        reversa = 0;
        Movimiento = 0;
        figuraenMovimiento = false;
        filaEnMovimiento = 0;
        Noseguir = false;
    }

    return dibujarPantalla();
    //  await delay(200);
    // console.clear();
    //}
}

function handleKeyPress(key) {
    if (key.toString() === 'd') {
        if ((figura.desplazimiento.punto2.x) < (TotaldeColumas)) {
            figura.desplazimiento.punto1.x += 1
            figura.desplazimiento.punto2.x += 1
        }
    } else if (key.toString() === 'a') {
        if ((figura.desplazimiento.punto1.x) > 0) {
            figura.desplazimiento.punto1.x -= 1
            figura.desplazimiento.punto2.x -= 1
        }
    } else if (key.toString() === 'q') {
        if (!entoncesRotar) {
            entoncesRotar = true;
        }

    }
}

rl.input.on('data', handleKeyPress);

module.exports = jugar();
