const ComentarioSchema = require('../models/ComentarioSchema');

const getComentario = async (req, res) => {
    try {
        const gameId = req.params.gameId;

        const comentarios = await ComentarioSchema.find({ gameId: gameId }).sort({ createdAt: -1 }).exec();

        res.status(200).json(comentarios);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar comentários do jogo. " + error });
    }   
};
const create = async (req, res) => {
    try {
        const novoComentario = await ComentarioSchema.create(req.body);
        res.status(201).json(novoComentario);
    }
    catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar comentário. " + error });
    }   
};

const remove = async (req, res) => {
    try {
        const comentarioId = req.params.comentarioId;
        
        const comentarioDeletado = await ComentarioSchema.findByIdAndDelete(comentarioId).exec();

        if (!comentarioDeletado) {
            return res.status(404).json({ erro: "Comentário não encontrado." });
        }
        res.status(200).json({ mensagem: "Comentário deletado com sucesso." });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao deletar comentário. " + error });
    }
};

module.exports = {
    getComentario,
    create,
    remove
}