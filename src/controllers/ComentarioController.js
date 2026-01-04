const ComentarioSchema = require('../models/ComentarioSchema');
const {connectDB} = require('../config/DbClient');

exports.getComentario = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        await connectDB();

        const comentarios = await ComentarioSchema.find({ gameId: gameId }).sort({ createdAt: -1 }).exec();

        res.status(200).json(comentarios);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar comentários do jogo. " + error });
    }   
};
exports.create = async (req, res) => {
    try {
        await connectDB();  
        const novoComentario = await ComentarioSchema.create(req.body);
        res.status(201).json(novoComentario);
    }
    catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar comentário. " + error });
    }   
};