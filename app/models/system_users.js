(() => {
    "use strict";

    let crypto = require('crypto');
    let mongoose = require('mongoose');
    let uniqueValidator = require('mongoose-unique-validator');
    let Schema = mongoose.Schema;

    let systemUsersSchema = new mongoose.Schema({

        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        pass: {type: String, required: true},
        token: {type: String, default: crypto.randomBytes(64).toString('hex')},

        // TODO: make this
        last_update: {
            date: {type: Date},
            user: {type: Schema.Types.ObjectId, ref: 'system_users'},
        },

        role: {type: String, enum: ['admin', 'user'], required: true}

    });

    systemUsersSchema.pre('save', function (next) {
        this.pass = crypto.createHash('md5').update(this.pass).digest("hex");
        return next();
    });

    systemUsersSchema.plugin(uniqueValidator);

    module.exports = mongoose.model('system_users', systemUsersSchema);

})();