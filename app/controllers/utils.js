(() => {
    "use strict";

    let restify = require('restify');
    let passport = require('passport');
    let https = require('https');

    let config = require('../../config');
    let log = require('../utils/logger');

    let controller = (server) => {

        server.get('/loaderio-' + config.loaderio_token + '.txt', (req, res, next) => {
            res.set('Content-Type', 'text');
            res.send('loaderio-' + config.loaderio_token);
            res.end();
        });

        server.on('InternalServer', (req, res, err, cb) => {
            let error = {
                err: err,
                cb: cb
            };

            log.error(error);

            res.send(error);
            res.end();
        });

        server.on('uncaughtException', (req, res, err, cb) => {

            log.error(err);
            log.error(cb);

            res.send(cb);
            res.end();
        });

        server.on('ResourceNotFound', (req, res, err, cb) => {

            log.error(err);

            res.send(err);
            res.end();

        });

        server.get(/.*/, restify.serveStatic({
            'directory': 'app/doc',
            'default': 'index.html'
        }));

    };

    module.exports.controller = controller;

})();