const { Socket, Server } = require("socket.io");

/**
 * @type {ListOfUsers}
 */
const users = {
    amountOfUsers: 0,
    patients: [],
    doctors: []
};





/**
 * @param {User} user Los datos del usuario que se intenta conectar. type y userId
 * @param {Socket} socket El objeto del socket que se intenta conectar
 * @returns {Promise<void>}
 */
const registerUserConnection = async (user, socket) => {

    const userConnected = await isUserAlreadyConnected(user);
    if (userConnected) {
        socket.emit('error', 'Usuario ya conectado');
        socket.disconnect(); // disconnect the user that is trying to connect
        await removeConnectedUser(userConnected, 'error', 'Sesion cerrada por intento de duplicidad de sesion');
        return;
    }

    const newUser = { ...user, socket };

    if (user.type === 'MEDICO') {
        users.doctors.push(newUser);
    } else if (user.type === 'PACIENTE') {
        users.patients.push(newUser);
    }
    users.amountOfUsers++;

    ///
    console.log(JSON.stringify(users, (key, value) => {
        if (key === 'socket') return value?.id; // Excluir la propiedad 'socket'
        return value;
    }));
    ///
};




/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllPatients = async () => {
    return [...users.patients];
};

/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllDoctors = async () => {
    return users.patients;
};


/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllConnectedUsers = async () => {
    return [...users.doctors, ...users.patients];
};



/**
 * 
 * @param {UserConnected} userConnected
 * @param {string} [typeOfMessage='alert'] - Tipo de mensaje que se le enviara al usuario, por defecto es 'alert'
 * @param {string} [message='Sesion cerrada'] - Mensaje a enviar al usuario, por defecto es 'Sesion cerrada'
 * @returns {Promise<void>}
 */
const removeConnectedUser = async (userConnected, typeOfMessage = 'alert', message = 'Sesion cerrada') => {
    userConnected.socket.emit('alert', message);
    userConnected.socket.disconnect();
    if (users.type === 'MEDICO') {
        users.doctors = users.doctors.filter(u => u.userId !== userConnected.userId);
    } else {
        users.patients = users.patients.filter(u => u.userId !== userConnected.userId);
    }

    users.amountOfUsers--;
};


/**
 * 
 * @param {User} user 
 * @returns {Promise<UserConnected | undefined>}
 */
const isUserAlreadyConnected = async (user) => {
    const userConnected = [
        ...users.doctors,
        ...users.patients
    ].find(u => u.userId === user.userId);
    return userConnected;
};






/**
 * @typedef {Object} User
 * @property {string} type
 * @property {Number} userId
*/

/**
 * @typedef {Object} UserConnected
 * @property {string} type
 * @property {Number} userId
 * @property {Socket} socket
 */

/**
 * @typedef {Object} ListOfUsers
 * @property {number} amountOfUsers
 * @property {UserConnected[]} patients
 * @property {UserConnected[]} doctors
 */

module.exports = {
    registerUserConnection,
    getAllPatients,
    removeConnectedUser,
    getAllDoctors,
    getAllConnectedUsers

};