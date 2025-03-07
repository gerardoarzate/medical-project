const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const { getUserAndTypeOfUserByEmail } = require('../repositories/UserRepository');

const badRequestMessage = { message: 'Invalid fields' };
const serverErrorMessage = { message: 'Error in server' };
const userUnauthorizedMessage = { message: "Usuario no autorizado" };
const loginSuccessMessage = { message: "Login exitoso" };



const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || typeof (email) != 'string' || typeof (password) != 'string') {
        console.log(req.body)
        return res.status(400).send(badRequestMessage);
    }

    try {
        
        const user = await getUserAndTypeOfUserByEmail(email);
        if (!user) {
            return res.status(401).json(userUnauthorizedMessage);
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.send(401).json(userUnauthorizedMessage);
        }
        const token = jwt.sign({ userId: user.id, type: user.tipo }, process.env.JWT_SECRET, { expiresIn: '12h' })
        return res.status(200).json({ ...loginSuccessMessage, token })
    } catch (error) {
        console.log(error)
        res.status(500).json(serverErrorMessage);
    }

};



module.exports = loginController;