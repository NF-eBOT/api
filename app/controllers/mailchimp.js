(() => {
    "use strict";

    let passport = require('passport');
    let unirest = require('unirest');

    let config = require('../../config');

    module.exports.controller = (server) => {

        /**
         * @api {get} mailchimp/total_subscribers GET Total Subscribers
         * @apiGroup Mailchimp
         * @apiHeader (Header) {String} X-TOKEN Authorization token.
         *
         * @apiSuccessExample Success-Response:
         *  HTTP 200 OK
         *
         * @apiErrorExample {json} Error-Response:
         *  HTTP 500 Server Error
         *
         */
        server.get('mailchimp/total_subscribers', passport.authenticate('token'), (req, res, next) => {

            unirest
                .get(`${config.mailchimp.host}/`)
                .auth({
                    user: 'jonatasfreitasv',
                    pass:config.mailchimp.token
                })
                .type('application/json')
                .end(function (response) {

                    if (response.error)
                        res.send(500, response);
                    else
                        res.send(200, response.body.total_subscribers);

                    return next();

                });

        });


    };

})();