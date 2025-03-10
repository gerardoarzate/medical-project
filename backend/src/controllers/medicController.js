const medicRepository = require('../repositories/medicRepository');
const { generateToken } = require('../utils/tokenUtils');
/**
 * 
 * @param {{name: string, lastname: string, password: string, telephone: string, email: string, licence: string, idSpeciality: number}} medic 
 * los datos del médico a crear
 * @returns {Promise<{id: number, name: string, lastname: string, telephone: string, email: string, licence: string, idSpeciality: number}>}
 * los datos del médico creado
 * @throws {Error} si hay un error en la consulta
 */
const createDoctor = async (req, res, next) => {
    const medic = req.body;

    try{

        const medicCreated = await medicRepository.createMedic(medic);
        const token = generateToken(medicCreated.id, "MEDICO");
    
        const response = {
            message: "Doctor created",
            token
        };
    
        return res.status(201).json(response);
    }catch(error){
        return next(error);
    }
};






module.exports = {
    createDoctor
}




