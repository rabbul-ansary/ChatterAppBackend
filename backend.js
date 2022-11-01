const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { flash } = require('express-flash-message');
const requestIp = require('request-ip');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
// express-session
app.use(
    session({
        secret: 'MyS3cr3tK3y',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            // secure: true,
        },
    })
);
app.use(cors())
app.use(flash({ sessionKeyName: 'flashMessage' }));
const allowedMethods = ['GET', 'HEAD', 'POST'];
const options = {
    // pingTimeout: 30000,
    allowEIO3: true,
    cors: {
        origin: '*',
        methods: allowedMethods,
        // allowedHeaders: ["x-access-token"],
        credentials: true
    }
};


global.auth = require(path.resolve(path.join(__dirname, 'src/middlewares', "authenticate")))();

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, max-age=3600');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    res.locals.messages = req.flash();
    auth = require(path.resolve(path.join(__dirname, 'src/middlewares', "authenticate")))(req, res, next);
    app.use(auth.initialize());
    // This is for api end
    if (req.headers['x-access-token'] != null) {
        req.headers['token'] = req.headers['x-access-token'];
    }
    req.ip_address = requestIp.getClientIp(req);
    next();
});

const server = http.createServer(app);
// Socket IO
const io = require('socket.io')(server, options);
io.on('connection', (socket) => {
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
    socket.broadcast.emit('id: , ' + socketId + ' joined.');
    socket.emit('Welcome, ' + clientIp);

    socket.on('disconnect', () => {
        socket.broadcast.emit(socketId + ' left.');
    });
});
app.use(function(req, res, next) {
    req.io = io;
    next();
});

(async () => {
    await require(path.resolve(path.join(__dirname, 'src/configs', 'database')))();
    // API Routes
    const apiFiles = fs.readdirSync(`./src/routes/api/`);
    apiFiles.forEach(file => {
        if (!file && file[0] == '.') return;
        app.use(`/api`, require(path.join(__dirname, 'src/routes/api', file)));
    });
    // Admin Routes
    const adminFiles = fs.readdirSync(`./src/routes/admin/`);
    adminFiles.forEach(file => {
        if (!file && file[0] == '.') return;
        app.use(`/`, require(path.join(__dirname, 'src/routes/admin', file)));
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log('server is running on port ' + port);
    });
})();