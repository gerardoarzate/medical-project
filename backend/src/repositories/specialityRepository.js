const db = require('../config/db').getDB();

/**
 * 
 * @returns {Promise<speciality[]:{id: number, nombre: string}[]>} array de especialidades
 */
const getSpecialities = async () => {
    const queryGetSpecialities = `SELECT * FROM especialidades`;
    const [specialities] = await db.query(queryGetSpecialities);
    return specialities;
};


module.exports = {
    getSpecialities
};