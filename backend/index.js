require('dotenv').config();
const express = require('express');
const socketIOServer = require('socket.io');
const app = express();

const { connectDB } = require('./src/config/db');
const socketController = require('./src/controllers/socketController');



async function startServer() {
    await connectDB();
    const loginRoute = require('./src/routes/login'); // importante cargar las rutas despues de conectar con la BD

    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Listening on port ${server.address().port}`);
    });
    const io = socketIOServer(server);

    app.use(express.json());

    app.use(loginRoute);


    io.on('connection', socketController(io));
};

startServer();
