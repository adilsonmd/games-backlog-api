const mongoose = require('mongoose');

const ColecaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    games: { type: Array, required: false },
});

module.exports = mongoose.model('Colecao', ColecaoSchema);