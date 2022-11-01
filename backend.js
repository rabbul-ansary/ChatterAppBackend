const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const { flash } = require('express-flash-message');
require('dotenv').config();
const app = express();
// express-session
app.use(
    session({
      secret: 'MyS3cr3tK3y',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7,
        // secure: true,
      },
    })
  );
  
  app.use(flash({ sessionKeyName: 'flashMessage' }));

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
    const server = http.createServer(app);
    const port = process.env.PORT || 80;
    server.listen(port, () => {
        console.log('server is running on port '+port);
    });
})();