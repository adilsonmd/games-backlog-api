const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    igdb_id: {type: Number, required: false },
    steam_id: {type: Number, required: false },
    psn_id: {type: String, required: false },
    titulo: {type: String, required: true, },
    statusCompra: {type: String, enum: ['Wishlist', 'Pre-venda', 'Adquirido'], default: 'Wishlist'},
    status: {type: String, enum: ['Backlog', 'Jogando', 'Pausado', 'Finalizado', 'Cancelado'], default: 'Backlog'},
    urlImagem: {type: String, default: null},
    horasJogadas: { type: Number, default: 0},
    plataformaAdquirida: [{type: String}],
    ultimaSessao: {type: Date, default: null},
    midiaFisica: {type: Boolean, default: false},
    midiaDigital: {type: Boolean, default: false},
    namorada_flag: {type: Boolean, default: false},
    favorito_flag: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Game', GameSchema);