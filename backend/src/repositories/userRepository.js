const db = require('../config/db').getDB();


/**
 * Obtiene los datos del usuario y su tipo (medico o paciente) basado en el correo electrónico.
 * 
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<{id: number, nombre:string, apellidos:string, email: string, password: string, tipo: string}> | null} -
 * - Un objeto que contiene los datos del usuario (id, email, password) y el tipo (medico o paciente) o null si no se encuentra el usuario.
 * @throws {Error} Si no se encuentra el usuario o hay un error en la consulta.
 */
const getUserAndTypeOfUserByEmail = async (email) => {

    const query = `
        SELECT
            usuarios.id, 
            usuarios.nombre,
            usuarios.apellidos,
            usuarios.email,
            usuarios.password,
            COALESCE(
                (SELECT 'MEDICO' FROM medicos WHERE medicos.id_usuario = usuarios.id LIMIT 1), 
                (SELECT 'PACIENTE' FROM pacientes WHERE pacientes.id_usuario = usuarios.id LIMIT 1)
            ) AS tipo
        FROM 
        usuarios 
        WHERE 
        usuarios.email = "${email}"
    `;

    const [rows] = await db.query(query);
    const user = rows[0];
    
    return user;
    
};



module.exports = {
    getUserAndTypeOfUserByEmail
};