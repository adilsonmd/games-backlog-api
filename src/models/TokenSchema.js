const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    provider: {type: String, default: 'PSN'},
    authorization: {type: Object}
});

module.exports = mongoose.model('Token', TokenSchema);