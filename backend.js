const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

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
    next();
});


(async () => {
    await require(path.resolve(path.join(__dirname, 'src/configs', 'database')))();
    const apiFiles = fs.readdirSync(`./src/routes`);
    apiFiles.forEach(file => {
        if (!file && file[0] == '.') return;
        app.use(`/api`, require(path.join(__dirname, 'src/routes/', file)));
    });
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log('server is running on port 2000');
    });
})();