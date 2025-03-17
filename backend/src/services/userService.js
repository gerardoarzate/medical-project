const { Socket, Server } = require("socket.io");
const requestService = require("./requestService");
const TIME_TO_VERIFY_IF_REQUESTS_CAN_BE_ASSIGNED = 1700; // 1.7 seconds
/**
 * @type {ListOfUsers}
 */
const users = {
    amountOfUsers: 0,
    patients: [],
    medics: []
};



setInterval(async() => {
    // verify in DB if there are requests that can be assigned
    // if there are, assign them
    // when a request is assigned, send a message to the medic and the patient
    // and add each other socket to the userConnected object of each user (medic to patient and patient to medic)
}, TIME_TO_VERIFY_IF_REQUESTS_CAN_BE_ASSIGNED);




/**
 * @param {User} user Los datos del usuario que se intenta conectar. type y userId
 * @param {Socket} socket El objeto del socket que se intenta conectar
 * @returns {Promise<void>}
 * 
 * @description Registra la conexion de un usuario en la lista de usuarios conectados, si tiene una solicitud 'Pendiente'
 * los respectivos datos de cada usuario se enviarán a los eventos 'receiveCounterpartData' de cada usuario
 */
const registerUserConnection = async (user, socket) => {

    const userConnected = await sameUserAlreadyConnected(user);
    if (userConnected) {
        socket.emit('error', 'Usuario ya conectado');
        socket.disconnect(); // disconnect the user that is trying to connect
        await removeConnectedUser(userConnected, 'error', 'Sesion cerrada por intento de duplicidad de sesion');
        return;
    }

    const newUser = { ...user, socket, location: null };
    if (user.type === 'MEDICO') { // this could be handled with specific methods for each type of user to themself add to the list of users
        users.medics.push(newUser);
    } else if (user.type === 'PACIENTE') {
        users.patients.push(newUser);
    }
    users.amountOfUsers++;
    ///
    console.log(JSON.stringify(users, (key, value) => {
        if (key === 'socket') return value?.id; // Excluir la propiedad 'socket'
        if (key === 'medicAssigned' || key === 'patientAssigned') return value?.userId;
        return value;
    }));
    ///
};




/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllConnectedPatients = async () => {
    return [...users.patients];
};

/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllConnectedMedics = async () => {
    return [...users.medics];
};


/**
 * 
 * @returns {Promise<UserConnected[]>}
 */
const getAllConnectedUsers = async () => {
    return [...users.medics, ...users.patients];
};


/**
 * 
 * @param {Number} patientId 
 * @returns {Promise<PatientConnected | undefined>}
 */
const getConnectedPatientById = async (patientId) => {
    return {...users.patients.find(p => p.userId === patientId)};
};

/**
 * 
 * @param {Number} medicId 
 * @returns {Promise<MedicConnected | undefined>}
 */
const getConnectedMedicById = async (medicId) => {
    return {...users.medics.find(m => m.userId === medicId)};
};


/**
 * 
 * @param {UserConnected} userConnected
 * @param {string} [typeOfMessage='alert'] - Tipo de mensaje que se le enviara al usuario, por defecto es 'alert'
 * @param {string} [message='Sesion cerrada'] - Mensaje a enviar al usuario, por defecto es 'Sesion cerrada'
 * @returns {Promise<void>}
 */
const removeConnectedUser = async (userConnected, typeOfMessage = 'alert', message = 'Sesion cerrada') => {
    // this if's could be handled with specific methods for each type of user to themself remove from the list of users
    if (userConnected.type === 'MEDICO') {
        users.medics = users.medics.filter(u => u.userId !== userConnected.userId);
        patient = users.patients.find(p => p?.medicAssigned?.userId === userConnected.userId);
        if (patient) {
            patient.medicAssigned = null;
        }
    } else {
        users.patients = users.patients.filter(u => u.userId !== userConnected.userId);
        medic = users.medics.find(m => m?.patientAssigned?.userId === userConnected.userId);
        if (medic) {
            medic.patientAssigned = null;
        }
    }
    userConnected.socket.emit('alert', message);
    userConnected.socket.disconnect();

    users.amountOfUsers--;
};


/**
 * 
 * @param {User} user 
 * @returns {Promise<UserConnected | undefined>}
 */
const sameUserAlreadyConnected = async (user) => {
    const userConnected = [
        ...users.medics,
        ...users.patients
    ].find(u => u.userId === user.userId);
    return userConnected;
};




const setAssignedPatientToMedic = async (patient, medic) => {
    const patientConnected = users.patients.find(p => p.userId === patient.userId);
    const medicConnected = users.medics.find(m => m.userId === medic.userId);

    patientConnected? patientConnected.medicAssigned = medicConnected : null;
    medicConnected? medicConnected.patientAssigned = patientConnected : null; 

    medic.patientAssigned = patientConnected;
    patient.medicAssigned = medicConnected;
}


const setAssignedMedicToPatient = async (medic, patient) => {
    const patientConnected = users.patients.find(p => p.userId === patient.userId);
    const medicConnected = users.medics.find(m => m.userId === medic.userId);

    patientConnected.medicAssigned = medicConnected;
    medicConnected.patientAssigned = patientConnected;

    medic.patientAssigned = patientConnected;
    patient.medicAssigned = medicConnected;
}


/**
 * 
 * @param {UserConnected} userConnected
 * @param {String} location 
 */
const updateLocation = async (userConnected, location) => {
    userConnected.location = location

    if(userConnected.type === 'MEDICO'){
        users.medics.find(m => m.userId === userConnected.userId).location = location;
    }else{
        users.patients.find(p => p.userId === userConnected.userId).location = location;
    }
};


/**
 * 
 * @param {UserConnected} userConnected 
 */
const removeRelation = (userConnected) => {
    if (userConnected.type === 'MEDICO') {
        const currentMedic = users.medics.find(m => m.userId === userConnected.userId);
        const currentPatient = users.patients.find(p => p.userId === currentMedic.patientAssigned.userId);

        if (currentMedic?.patientAssigned) {
            currentMedic.patientAssigned.medicAssigned = null;
        }

        if (currentPatient?.medicAssigned) {
            currentPatient.medicAssigned.patientAssigned = null;
        }

        currentMedic.patientAssigned = null;
    } else if (userConnected.type === 'PACIENTE') {
        const currentPatient = users.patients.find(p => p.userId === userConnected.userId);
        const currentMedic = users.medics.find(m => m.userId === currentPatient.medicAssigned.userId);

        if (currentPatient?.medicAssigned) {
            currentPatient.medicAssigned.patientAssigned = null;
        }

        if (currentMedic?.patientAssigned) {
            currentMedic.patientAssigned.medicAssigned = null;
        }

        currentPatient.medicAssigned = null;
    }
};




/**
 * 
 * @param {MedicConnected} MEDIC 
 */


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
 * @property {String} location
 */

/**
 * @class
 * @extends {UserConnected}
 * @typedef {Object} MedicConnected
 * @property {string} type
 * @property {Number} userId
 * @property {Socket} socket
 * @property {UserConnected} patientAssigned
 * @property {String} location
 */

/**
 * @class
 * @extends {UserConnected}
 * @typedef {Object} PatientConnected
 * @property {string} type
 * @property {Number} userId
 * @property {Socket} socket
 * @property {UserConnected} medicAssigned
 * @property {String} location
 */

/**
 * 
 * @param {PatientConnected} ejemplo 
 */

/**
 * @typedef {Object} ListOfUsers
 * @property {number} amountOfUsers
 * @property {PatientConnected[]} patients
 * @property {MedicConnected[]} medics
 */



module.exports = {
    registerUserConnection,
    getAllConnectedPatients,
    removeConnectedUser,
    getAllConnectedMedics,
    getAllConnectedUsers,
    getConnectedPatientById,
    getConnectedMedicById,
    setAssignedPatientToMedic,
    setAssignedMedicToPatient,
    updateLocation,
    removeRelation

};