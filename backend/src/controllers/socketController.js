const { Socket, Server } = require("socket.io");
const { getTypeAndIdFromToken } = require('../utils/tokenUtils');
const userService = require('../services/userService');


/**
* @param {Server} io
*/
const onConnection = (io) =>{
    console.log("user connected");

    /**
    * @param {Socket} socket - El objeto socket que maneja la conexión de un cliente.
    */
    return async (socket) => {
        const token = socket.handshake.auth.token;
        const user = authenticateUser(socket, token);
        if(!user){
            return;
        }
        await handlerNewUserConnection(user, socket, io);
    };
};



/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 */
const handlerNewUserConnection = async (user, socket, io) => {    
    await userService.registerUserConnection(user, socket); // add to the list of users connected
    const clientToServerEventHandlers = require('../services/clientToServerEventHandlers')(socket, io); // get the event handlers file which contain all the events that the user can do

    if(user.type == 'MEDICO'){ // every type of user has different events
        handlerMedicConnection(socket, user);
    }else if(user.type == 'PACIENTE'){
        handlerPatientConnection(socket, user);
    }


    //// events that are common for all users

    socket.on('disconnect', clientToServerEventHandlers.onDisconnect(user));
};



/**
 * 
 * @param {Socket} socket 
 * @param {string} token 
 * @returns {User}
 */
const authenticateUser = (socket, token) => {
    try{
        user = getTypeAndIdFromToken(token);
        return user;
    }catch(error){
        console.log('user dont have permission');
        socket.emit('error', 'No tienes permiso para conectarte, token invalido');
        socket.disconnect();
        return;
    }
};


/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 * @param {Server} io 
 * 
 * Se definen los eventos que un medico puede disparar
 */
const handlerMedicConnection =  (socket, user, io) => {
    // add all the process that a medic can do, add all that process in serivices folder
}


/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 * @param {Server} io 
 * 
 * Se definen los eventos que un paciente puede disparar
 */
const handlerPatientConnection =  (socket, user, io) => {
    // add all the process that a patient can do, add all that process in serivices folder
}

/**
 * @typedef {Object} User
 * @property {string} type
 * @property {Number} userId
 */

module.exports = onConnection;