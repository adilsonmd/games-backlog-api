const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    provider: {type: String, default: 'PSN'},
    authorization: {type: Object},
    updated_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Token', TokenSchema);