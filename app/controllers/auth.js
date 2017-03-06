(() =>  {
    "use strict";

    let passport = require('passport');
    let crypto = require('crypto');

    let SystemUsers = require('../models/system_users');

    module.exports.controller = (server) =>  {
        
        /**
         * @api {post} /auth AUTH
         * @apiGroup Authentication
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParamExample {json} Request-Example:
         *  {
         *      email: "admin@admin.com",
         *      pass: "123456"
         *  }
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        server.post('auth', (req, res, next) =>  {

            SystemUsers.findOne({

                email: req.body.email,
                pass: crypto.createHash('md5').update(req.body.pass).digest("hex")

            }, (err, data) => {

                if(err || !data)
                    res.send(401);
                else
                    res.send(200, data);

                return next();

            });

        });

        /**
         * @api {get} /auth/:token AUTH with Token
         * @apiGroup Authentication
         *
         * @apiParam (Parameters) {String} token System User token
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        server.get('auth/:token', (req, res, next) =>  {

            SystemUsers.findOne({
                token: req.params.token
            }, (err, data) => {

                if(err || !data)
                    res.send(401);
                else
                    res.send(200, data);

                return next();

            });

        });

        /**
         * @api {get} /logout/:id LOGOUT
         * @apiGroup Authentication
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Parameters) {String} id System User id
         *
         * @apiSuccessExample Success-Response:
         *  HTTPS 204 No Content
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        server.get('logout/:id', passport.authenticate('token'), (req, res, next) =>  {

            SystemUsers.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        token: crypto.randomBytes(64).toString('hex')
                    }
                },
                (err) =>  {

                    if (err)
                        res.send(401);
                    else
                        res.send(204);

                    return next();

                });

        });

    };

})();