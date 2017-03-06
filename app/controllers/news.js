(() => {
    "use strict";

    let passport = require('passport');

    let News = require('../models/news');

    module.exports.controller = (server) => {

        /**
         * @api {get} /news/:id? GET
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Optional Parameters) {Number} id News id
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *  HTTP 404 Not Found
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        let getHandler = (req, res, next) => {

            let query = {};

            if(req.params.id)
                query._id = req.params.id;

            News.find(query)
                .exec((err, data) => {

                    if(err) {
                        res.send(401);
                        return next();
                    }

                    if(req.params.id && !data) {
                        res.send(404);
                        return next();
                    }

                    res.send(data);
                    return next();

                });

        };
        server.get('news', passport.authenticate('token'), getHandler);
        server.get('news/:id', passport.authenticate('token'), getHandler);

        /**
         * @api {get} news/title/:title GET by Title
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Parameters) {String} title News title
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *  HTTP 404 Not Found
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        server.get('news/title/:title', passport.authenticate('token'), (req, res, next) => {

            let query = {
                title: req.params.title
            };

            News.findOne(query)
                .exec((err, data) => {

                    if(err) {
                        res.send(401);
                        return next();
                    }

                    if(req.params.id && !data) {
                        res.send(404);
                        return next();
                    }

                    res.send(data);
                    return next();

                });

        });

        /**
         * @api {post} /news/search SEARCH
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParamExample {json} Request-Example:
         *  See news model on api project
         *
         * @apiSuccessExample Success-Response:
         *  HTTPS 201 No Content
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 400 Bad Request
         *
         */
        server.post('news/search', passport.authenticate('token'),
            (req, res, next) => {

                let query = req.body;

                News.find(query)
                    .exec((err, data) => {

                        if(err) {
                            res.send(401);
                            return next();
                        }

                        res.send(data);
                        return next();

                    });

            });

        /**
         * @api {post} /news POST
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParamExample {json} Request-Example:
         *  See news model on api project
         *
         * @apiSuccessExample Success-Response:
         *  HTTPS 201 No Content
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 400 Bad Request
         *
         */
        server.post('news', passport.authenticate('token'),
            (req, res, next) => {

                let _new = new News(req.body);

                News.count(
                    {title: _new.title},
                    (err, count) => {

                        if(count === 0) {

                            _new
                                .save((err, _new) => {

                                    if(err)
                                        res.send(400, err.errors);
                                    else
                                        res.send(201, _new);

                                    return next();

                                });

                        }
                        else {
                            res.send(409, 'This news already exists');
                            return next();
                        }

                    }
                );

            });

        /**
         * @api {put} /news/:id PUT
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Parameters) {Number} id News id
         *
         * @apiParamExample {json} Request-Example:
         *  See news model on api project
         *
         * @apiSuccessExample Success-Response:
         *  HTTPS 204 No Content
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 400 Bad Request
         *
         */
        server.put('news/:id', passport.authenticate('token'),
            (req, res, next) => {

                News
                    .findByIdAndUpdate(
                        req.params.id,
                        {
                            $set: req.body,
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

        server.get('news/app/list',
            (req, res, next) => {


                News
                    .find({})
                    .sort({created_at: 'desc'})
                    .limit(17)
                    .select({
                        "_id": 1,
                        "created_at": 1,
                        "scraper": 1,
                        "title": 1
                    })
                    .exec((err, data) => {

                        if(err) {
                            res.send(401);
                            return next();
                        }

                        res.send(JSON.stringify(data));
                        return next();

                    });
            });

        /**
         * @api {get} news/title/:title GET by Title
         * @apiGroup News
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiParam (Parameters) {String} title News title
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *  HTTP 404 Not Found
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 401 Unauthorized
         *
         */
        server.get('news/feed/rss', (req, res, next) => {

            News
                .find({})
                .sort({created_at: 'desc'})
                .limit(20)
                .select({
                    "_id": 1,
                    "created_at": 1,
                    "scraper": 1,
                    "title": 1
                })
                .exec((err, data) => {

                    if(err) {
                        res.send(401);
                        return next();
                    }

                    res.send(JSON.stringify(data));
                    return next();

                });

        });

    };

})();