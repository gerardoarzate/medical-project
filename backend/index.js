require('dotenv').config();
const express = require('express');
const socketIOServer = require('socket.io');
const app = express();

const { connectDB } = require('./src/config/db');
const socketController = require('./src/controllers/socketController');
const authMiddleware = require('./src/middlewares/auth');
const notFoundMiddleware = require('./src/middlewares/notFound');
const errorMiddleware = require('./src/middlewares/error');

async function startServer() {
    await connectDB();
    const loginRoute = require('./src/routes/login'); // IMPORTANT: load the routes after connecting to the database
    const medicRoutes = require('./src/routes/medicRoutes');// because routes need the database connection already established
    const patientRoutes = require('./src/routes/patientRoute');
    const specialityRoutes = require('./src/routes/specialityRoute');

    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Listening on port ${server.address().port}`);
    });
    const io = socketIOServer(server);
    app.use(express.json());



    // routes which don't need authentication
    app.get('/', function (req, res) { res.sendFile(__dirname + '/' + 'test-index.html'); });
    app.use(loginRoute);
    app.use(medicRoutes);
    app.use(patientRoutes);
    app.use(specialityRoutes);
    io.on('connection', socketController(io));
    
    app.use(authMiddleware);
    // routes which need authentication

    // error handling middleware
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

};

startServer();
