const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
    gameId: {type: mongoose.Types.ObjectId, required: true},
    texto: {type: String, required: true},
    dataCriacao: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Comentario', ComentarioSchema);