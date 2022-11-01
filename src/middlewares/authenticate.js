const passport = require('passport');
const passportJWT = require('passport-jwt');
const UserModel = require('../models/user.model');
const requestIp = require('request-ip');
const mongoose = require('mongoose');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
    secretOrKey: 'MyS3cr3tK3Y',
    jwtFromRequest: ExtractJwt.fromHeader('token')
};


module.exports = () => {
    const strategy = new Strategy(params, (payload, done) => {
        UserModel.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(payload.id) } },
        ]).exec((err, user) => {
            if (err) {
                return done(err, false);
            } else if (user && user.length) {
                done(null, user[0]);
            } else {
                done(null, false);
            }
        });
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticateAPI: (req, res, next) => {
            passport.authenticate('jwt', 'MyS3cr3tK3Y', async (err, user, info) => {
                if (err) {
                    return res.send({
                        status: 500,
                        auth: false,
                        message: 'Failed to authenticate token.'
                    });
                } else if (user) {
                    req.user = user;
                    return next();
                } else {
                    return res.send({
                        status: 500,
                        auth: false,
                        message: "There was a problem finding the user."
                    });
                }
            })(req, res, next);
        }
    }
}

