const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    gameId: {type: mongoose.Types.ObjectId, required: true},
    url: {type: String, required: true},
    isCover: {type: Boolean, default: false},
});

module.exports = mongoose.model('Image', ImageSchema);