const ImageSchema = require('../models/ImageSchema');

const getImagesForGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        console.log(`[ImageController] Buscando imagens para o jogo ID: ${gameId}`); 

        const image = await ImageSchema.find({gameId: gameId});

        if (image){
            res.status(200).json(image);
        }
        else {
            res.status(400).json({erro: "Não encontrado"});
        }
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar imagens do jogo. " + error });
    }
};

const create = async (req, res) => {
    try {
        const novaImagem = await ImageSchema.create(req.body);
        res.status(201).json(novaImagem);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar imagem. " + error });
    }   
};

const remove = async (req, res) => {
    try {
        const imagemRemovida = await ImageSchema.findByIdAndDelete(req.params.id);

        if (!imagemRemovida) {
            return res.status(404).json({ erro: "Imagem não encontrada" });
        }
        res.status(200).json({ mensagem: "Imagem removida com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao remover imagem. " + error });
    }
};

module.exports = {
    getImagesForGame,
    create,
    remove
}