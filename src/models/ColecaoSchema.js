import mongoose from 'mongoose';

const ColecaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    games: { type: Array, required: false },
});

export default mongoose.model('Colecao', ColecaoSchema);