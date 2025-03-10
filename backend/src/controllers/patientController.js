const patientRepository = require("../repositories/patientRepository");
const { generateToken } = require("../utils/tokenUtils");


const createPatient = async (req, res, next) => {
    const patient = req.body;

    try{

        const patientCreated = await patientRepository.createPatient(patient);
        const token = generateToken(patientCreated.id, "PACIENTE");
    
        const response = {
            message: "Patient created",
            token
        };
    
        return res.status(201).json(response);
    }catch(error){
        return next(error);
    }

};





module.exports = {
    createPatient
};