const net = require('net');

const server = net.createServer((socket) => {
    console.log('Cliente conectado');
    //socket.connect();
    console.log("===========================", socket.writable);
    if (socket.writable) {
        socket.write("hola como estan");
        /*socket.write('¡Bienvenido al servidor de texto!\r\n');
        socket.write('Escribe "exit" para salir.\r\n\r\n');*/

    } else {
        console.log('El socket no está disponible para escritura.');
    }


    /*socket.on('data', (data) => {
        const command = data.toString().trim().toLowerCase();

        if (command === 'exit') {
            socket.end('¡Hasta luego!\r\n');
        } else {
            socket.write(`Escribiste: "${data.toString()}"\r\n`);
        }
    });*/

    socket.on('end', () => {
        console.log('Conexión cerrada por el servidor');
    });
    // Manejar eventos de cierre de conexión
    socket.on('close', () => {
        //console.log(process.env.PORT);
        console.log('Cliente desconectado');
    });

    socket.on('error', (err) => {
        //console.log(process.env.PORT);
        console.error('Error de conexión:', err);
    });
});

const port = process.env.PORT ?? 3000;
server.listen(port, () => {
    console.log('Servidor de texto escuchando en el puerto ' + port);
});
