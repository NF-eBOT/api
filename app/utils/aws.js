(function () {
    "use strict";

    var AWS = require('aws-sdk');

    var config = require('../../config');

    AWS.config.region = config.aws.region;
    AWS.config.update(config.aws);
    AWS.config.credentials.accessKeyId = config.aws.accessKeyId;
    AWS.config.credentials.secretAccessKey = config.aws.secretAccessKey;

    module.exports = AWS;

})();