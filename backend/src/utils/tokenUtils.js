const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const timeToExpireToken = process.env.TIME_TO_EXPIRE_TOKEN;


/**
 * 
 * @param {string} userId el id del usuario
 * @param {"MEDICO" | "PACIENTE" | string} type el tipo de usuario
 * @returns {string} el token generado
 */
const generateToken = (userId, type) => {
    return jwt.sign({ userId, type }, JWT_SECRET, { expiresIn: timeToExpireToken });
};


module.exports = {
    generateToken
};
