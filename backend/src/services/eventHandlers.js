const { Socket, Server } = require('socket.io');
const userService = require('../services/userService');
/**
 * 
 * @param {Socket} socket 
 * @param {Server} io 
 */
module.exports = (socket, io) => {
    return {
        /**
         * 
         * @param {User} user 
         * @returns { () => Promise<void>}
         */
        onDisconnect: (user) => {
            return async () => {
                console.log('user disconnected');
                const userConnected = { ...user, socket };
                await userService.removeConnectedUser(userConnected);
            }
        }
    };
};


/**
 * @typedef {Object} User
 * @property {string} type
 * @property {Number} userId
 */
