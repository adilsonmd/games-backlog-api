const {connectDB} = require('../config/DbClient');
const ImageSchema = require('../models/ImageSchema');

exports.getImagesForGame = async (req, res) => {
    try {
        await connectDB();

        const gameId = req.params.id;
        console.log(`[ImageController] Buscando imagens para o jogo ID: ${gameId}`); 
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar imagens do jogo. " + error });
    }
};

exports.create = async (req, res) => {
    try {
        await connectDB(); 
        const novaImagem = await ImageSchema.create(req.body);
        res.status(201).json(novaImagem);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar imagem. " + error });
    }   
};

exports.delete = async (req, res) => {
    try {
        await connectDB();
        const imagemRemovida = await ImageSchema.findByIdAndDelete(req.params.id);

        if (!imagemRemovida) {
            return res.status(404).json({ erro: "Imagem não encontrada" });
        }
        res.status(200).json({ mensagem: "Imagem removida com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao remover imagem. " + error });
    }
};