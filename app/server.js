(() => {
    "use strict";

    let fs = require('fs');
    let restify = require('restify');
    let passport = require('passport');
    let mongoose = require('mongoose');
    let createServer = require("auto-sni");

    let TokenStrategy = require('passport-accesstoken').Strategy;

    let log = require('./utils/logger');
    let config = require('../config');

    let SystemUsers = require('./models/system_users');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.databases.mongodb);

    let db = mongoose.connection;
    db.
    on('error', (err) => {
        log.error('MongoDB Connect Error', err);
        throw ('MongoDB Connect Error');
    })
    .once('open', (callback) => {
        log.info('MongoDB Connected');
    });

    createServer.https = restify;

    let server = createServer(config.letsencrypt);

    log.info(`API started over HTTPS ${config.letsencrypt.ports.https} and HTTP ${config.letsencrypt.ports.http}`);

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restify.gzipResponse());
    restify.CORS.ALLOW_HEADERS.push('X-TOKEN');
    restify.CORS.ALLOW_HEADERS.push('x-token');
    restify.CORS.ALLOW_HEADERS.push('accept');
    restify.CORS.ALLOW_HEADERS.push('sid');
    restify.CORS.ALLOW_HEADERS.push('lang');
    restify.CORS.ALLOW_HEADERS.push('origin');
    restify.CORS.ALLOW_HEADERS.push('withcredentials');
    restify.CORS.ALLOW_HEADERS.push('x-requested-with');
    server.use(restify.CORS());
    server.use(passport.initialize());
    server.use(passport.session());
    
    server.pre((req, res, next) => {

        log.info(
            {
                method: req.method,
                url: req.url,
                headers: req.headers,
                fields: req.log.fields
            }
        );

        return next();

    });

    // Authtentication
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new TokenStrategy((token, done) => {

        SystemUsers.findOne({
            token: token
        }, (err, data) => {

            if(err || !data) return done(null, false);
            else return done(null, data);

        });

    }));

    // Load all controllers
    fs.readdirSync('app/controllers').forEach((file) => {
        if (file.substr(-3) === '.js') {
            let route = require('./controllers/' + file);
            route.controller(server);
            log.info('Start controller: ' + file);
        }
    });

})();
