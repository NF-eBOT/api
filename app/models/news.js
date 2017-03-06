(function () {
    "use strict";

    let mongoose = require('mongoose');

    let newsSchema = new mongoose.Schema({

        title: {type: String, required: true, index: true},
        link: {type: String},
        date: {type: String},

        submitted: {type: Boolean, default: false},
        submitted_at: {type: Date },

        created_at: {type: Date, default: Date.now},

        scraper: {
            name: {type: String, required: true, index: true},
            page_url: {type: String, required: true},
            base_url: {type: String, required: true},
            interval: {type: Number, required: true}
        }

    });

    module.exports = mongoose.model('News', newsSchema);

})();