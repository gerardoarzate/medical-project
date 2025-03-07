const { Socket, Server } = require("socket.io");



/**
* @param {Server} io
*/
const onConnection = (io) =>{
    console.log("user connected");

    /**
    * @param {Socket} socket - El objeto socket que maneja la conexión de un cliente.
    */
    return (socket) => {
        console.log(socket.handshake.auth);
        const onDisconnect = (/* content */) => {
            console.log('user disconnected');
        }

        socket.on('disconnect', onDisconnect);
    };
};



module.exports = onConnection;