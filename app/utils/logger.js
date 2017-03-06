(function () {
    "use strict";

    var config = require('../../config.js');

    var bunyan  = require('bunyan');
    var Bunyan2Loggly = require('bunyan-loggly'),
        logglyConfig = {
            token: 'fa786ad0-9cd4-43c3-8e75-0a9bcaa4f87f',
            subdomain: 'devstage'
        },
        logglyStream = new Bunyan2Loggly(logglyConfig);

    module.exports = bunyan.createLogger({
        name: config.name,
        streams: [
            {
                stream: logglyStream,
                type: 'raw'
            },
            {
                stream: process.stdout
            }
        ]
    });

})();