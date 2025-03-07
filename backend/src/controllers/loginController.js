const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserAndTypeOfUserByEmail } = require('../repositories/UserRepository');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const timeToExpireToken = process.env.TIME_TO_EXPIRE_TOKEN;

const messages = {
    badRequest: { message: 'Invalid fields' },
    serverError: { message: 'Error in server' },
    unauthorized: { message: "Usuario no autorizado" },
    loginSuccess: { message: "Login exitoso" }
};


const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isInputLoginValid(email, password)) {
            return res.status(400).json(messages.badRequest);
        }

        const user = await getUserAndTypeOfUserByEmail(email);
        if (!user) {
            return res.status(401).json(messages.unauthorized);
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json(messages.unauthorized);
        }

        const token = generateToken(user);
        return res.status(200).json({ ...messages.loginSuccess, token });

    } catch (error) {
        return res.status(500).json(messages.serverError);
    }
};


const isInputLoginValid = (email, password) => {
    return email && password && typeof email === 'string' && typeof password === 'string';
}


const generateToken = (user) => {
    return jwt.sign({ userId: user.id, type: user.tipo }, JWT_SECRET, { expiresIn: timeToExpireToken });
};

module.exports = loginController;
