const db = require('../config/db').getDB();
const { hashPassword, generateToken } = require('../utils/tokenUtils');

/**
 * 
 * @param {{name: string, lastname: string, password: string, curp: string, age: number, sex: 'M' | 'F', height: number, weight: number, email: string, telephone: string}} patient 
 * los datos del paciente a crear
 * @returns {Promise<{id: number, name: string, lastname: string, curp: string, age: number, sex: 'M' | 'F', height: number, weight: number, email: string, telephone: string}>}
 * los datos del paciente creado
 */
const createPatient = async (patient) => { 

    const passwordHashed = await hashPassword(patient.password);
    const insertUserQuery = `
        INSERT INTO usuarios(nombre, apellidos, email, telefono, password) VALUES(?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(insertUserQuery, [patient.name, patient.lastname, patient.email, patient.telephone, passwordHashed]);
    const insertedId = result.insertId;

    const insertPacientQuery = `
        INSERT INTO pacientes(id_usuario, curp, edad, sexo, peso, estatura) VALUES(?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertPacientQuery, [insertedId, patient.curp, patient.age, patient.sex, patient.weight, patient.height]);
    return { id: insertedId, name: patient.name, lastname: patient.lastname, curp: patient.curp, age: patient.age}
};


module.exports = {
    createPatient
};