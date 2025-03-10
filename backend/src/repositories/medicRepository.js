const db = require('../config/db').getDB();
const bcrypt = require('bcrypt');
const bcryptSalt = Number(process.env.BCRYPT_SALT);



/**
 * 
 * @param {{name: string, lastname: string, password: string, telephone: string, email: string, licence: string, idSpeciality: number}} medic 
 * los datos del médico a crear
 * @returns {Promise<{id: number, name: string, lastname: string, telephone: string, email: string, licence: string, idSpeciality: number}>}
 * los datos del médico creado
 * @throws {Error} si hay un error en la consulta
 */
const createMedic = async (medic) => {

    const passwordHashed = await bcrypt.hash(medic.password, bcryptSalt);
    const insertUserQuery = `
        INSERT INTO usuarios(nombre, apellidos, email, telefono, password) VALUES(?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(insertUserQuery, [medic.name, medic.lastname, medic.email, medic.telephone, passwordHashed]);
    const insertedId = result.insertId;
    const insertMedicQuery = `
        INSERT INTO medicos(id_usuario, cedula, id_especialidad) VALUES(?, ?, ?)
    `;
    await db.query(insertMedicQuery, [insertedId, medic.licence, medic.idSpeciality]);
    return { id: insertedId, name: medic.name, lastname: medic.lastname, telephone: medic.telephone, email: medic.email, licence: medic.licence, idSpeciality: medic.idSpeciality };

};




module.exports = {
    createMedic
}