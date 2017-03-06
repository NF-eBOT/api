(() => {
    "use strict";

    let passport = require('passport');
    let crypto = require('crypto');
    let SystemUsers = require('../models/system_users');

    module.exports.controller = (server) => {

        /**
         * @api {get} /system_users/:id? GET
         * @apiGroup System Users
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Optional Parameters) {Number} id System User id
         *
         */
        let getHandler = (req, res, next) => {

            if(req.user.role != 'admin')
            {
                res.send(401);
                return next();
            }

            let query = {};

            if (req.params.id)
                query._id = req.params.id;

            SystemUsers.find(query,
                (err, data) => {

                    if(err) {
                        res.send(404);
                        return next();
                    }

                    res.send(data);
                    return next();

                });

        };
        server.get('system_users', passport.authenticate('token'), getHandler);
        server.get('system_users/:id', passport.authenticate('token'), getHandler);

        /**
         * @api {post} /system_users POST
         * @apiGroup System Users
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         */
        server.post('system_users', passport.authenticate('token'),
            (req, res, next) => {

                if(req.user.role != 'admin')
                {
                    res.send(401);
                    return next();
                }

                let system_user = new SystemUsers(req.body);

                system_user.save((err, data) => {

                    if (err)
                        res.send(400, err.errors);
                    else
                        res.send(201, data);

                    return next();

                });

            });

        /**
         * @api {put} /system_users/:id PUT
         * @apiGroup System Users
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Parameters) {String} id System User id
         *
         */
        server.put('system_users/:id', passport.authenticate('token'),
            (req, res, next) => {

                if (req.user.role != 'admin') {
                    res.send(401);
                    return next();
                }

                SystemUsers.findByIdAndUpdate(req.params.id,
                    {
                        $set: {
                            name: req.body.name,
                            email: req.body.email,
                            role: req.body.role,
                            pass: crypto.createHash('md5').update(req.body.pass).digest("hex")
                        },
                        $inc: {__v: 1}
                    },
                    (err) => {

                        if(err) {
                            res.send(400, err);
                            return next();
                        }

                        res.send(204);
                        return next();

                    });

            });

        /**
         * @api {delete} /system_users/:id DELETE
         * @apiGroup System Users
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         */
        server.del('system_users/:id', passport.authenticate('token'),
            (req, res, next) => {

                if(req.user.role != 'admin')
                {
                    res.send(401);
                    return next();
                }

                SystemUsers.findByIdAndRemove(req.params.id,
                    (err, result) => {

                        if (err)
                            res.send(404, err);
                        else
                            res.send(204);

                        return next();

                    });

            });

    };

})();