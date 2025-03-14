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
        
        await handlerUserConnected(socket, user);
       
        const onDisconnect = async(/* content */) => {
            console.log('user disconnected');
            const userConnected = {...user, socket};
            await userService.removeConnectedUser(userConnected);
        };
        socket.on('disconnect', onDisconnect);
    };
};



/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 */
const handlerUserConnected = async (socket, user) => {
    await userService.addConnectedUser(user, socket);
    if(user.type == 'MEDICO'){
        handlerMedicConnection(socket, user);
    }else if(user.type == 'PACIENTE'){
        handlerPatientConnection(socket, user);
    }


    
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
        socket.disconnect();
        return;
    }
};


/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 * @param {Server} io 
 */
const handlerMedicConnection =  (socket, user, io) => {
    // add all the process that a medic can do, add all that process in serivices folder
}


/**
 * 
 * @param {Socket} socket 
 * @param {User} user 
 * @param {Server} io 
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